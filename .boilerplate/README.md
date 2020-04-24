# Boilerplate

## Usage

### New Project

1. Prepare an empty git repository and clone it to your computer
2. Run the following command in the newly cloned folder:

```bash
TEMP_DIR="$(mktemp -d)" && git clone --depth=1 'https://bitbucket.org/nabstudio/boilerplates' "${TEMP_DIR}" && "${TEMP_DIR}/pipeline/boilerplate-init" && rm -rf "${TEMP_DIR}"
```

You will be ask for the project key and project name.

- **Project key**: used for deployment purposes (Ex. cluster name, module name, ...).
- **Project name**: used for displaying only (Ex. Title of the [`README.md`](../README.md), ...).

### Upgrade Project

Upgrade an existing project to use new boilerplates' commits.

```bash
./pipeline/boilerplate-upgrade
```

## Development

### Add New Feature

1. Branch out from `master`
2. Update the `dependencies` property in [`.boilerplate/config.json`](./config.json) with needed features' branches
3. Merge those features in by upgrading the boilerplate:

   ```bash
   ./pipeline/boilerplate-upgrade
   ```

### Push Feature

After `git push` changes, run the following command to push those changes to _dependant features_:

```bash
./.boilerplate/push
```
