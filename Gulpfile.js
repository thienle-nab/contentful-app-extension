const fs = require("fs");
const path = require("path");
const gulp = require("gulp");
const { series } = require("gulp");
const header = require("gulp-header");
const del = require("del");

// CONSTANTS
const LANGUAGES_TO_BE_LOCALIZED = ["ko", "zh"];
const PAGES_PATH = "src/pages";
const FOLDER_TO_LOCALIZE = "localize";

// UTILS
function getCountryCodeFromLanguageCode(languageCode) {
  const countryCodeMap = {
    en: "",
    ja: "jp",
    ko: "kr",
    zh: "cn",
  };

  return countryCodeMap[languageCode] || "";
}

// FILES TO BE LOCALIZED
const FILES_TO_BE_LOCALIZED_MAP = {
  "src/pages/index.ts": getFileMap(LANGUAGES_TO_BE_LOCALIZED, ""),
  ...getLocalizeFolderMap(FOLDER_TO_LOCALIZE),
};

function getFileMap(languages, dest, basePath = PAGES_PATH) {
  return languages.reduce((acc, cur) => {
    const countryCode = getCountryCodeFromLanguageCode(cur);
    acc[cur] = `${basePath}/${countryCode}/${dest}`;
    return acc;
  }, {});
}

function getFilesByDir(dir) {
  return fs.readdirSync(dir).filter(function (file) {
    return fs.statSync(path.join(dir, file)).isFile();
  });
}

function getLocalizeFolderMap(folder, basePath = PAGES_PATH) {
  const fullFolderPath = `${basePath}/${folder}`;
  const files = getFilesByDir(fullFolderPath);

  return files.reduce((acc, cur) => {
    const fullFilePath = `${basePath}/${folder}/${cur}`;
    acc[fullFilePath] = getFileMap(LANGUAGES_TO_BE_LOCALIZED, folder);
    return acc;
  }, {});
}

// GENERATE FILES
async function generateFiles() {
  const queue = Object.keys(FILES_TO_BE_LOCALIZED_MAP)
    .map(file => {
      const fileMap = FILES_TO_BE_LOCALIZED_MAP[file];
      return Object.keys(fileMap).map(langKey => {
        const newPath = fileMap[langKey];
        const linesToBeAdded = `import { changeLanguageTo } from "i18n/i18n";\nchangeLanguageTo("${langKey}");\n`;

        return () => queue.push(gulp.src(file).pipe(header(linesToBeAdded)).pipe(gulp.dest(newPath)));
      });
    })
    .reduce((acc, cur) => acc.concat(cur), []);

  return Promise.all(queue.map(item => item()));
}

// DELETE GENERATED FILES
async function deleteGeneratedFiles() {
  return Promise.all(
    LANGUAGES_TO_BE_LOCALIZED.map(async language => {
      await del(`${PAGES_PATH}/${language}`, { force: true });
    }),
  );
}

exports.generateFiles = generateFiles;
exports.deleteGeneratedFiles = deleteGeneratedFiles;
exports.default = series(deleteGeneratedFiles, generateFiles);
