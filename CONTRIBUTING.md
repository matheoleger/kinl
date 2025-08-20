# Branches

We use the following branches:

- **main**: The main branch. It contains the latest stable version of the project.
- **develop**: The develop branch. It contains the latest development version of the project.

To contribute, you need to create a new branch from the develop branch. The name of the branch should be in the following format:
```
<type>/<optional-scope>/<description>
```

### Type

Type just need to be clear. For example, it should be one of the following:

- **feature**: A feature branch. It contains a new feature.
- **fix**: A fix branch. It contains a bug fix.
- **hotfix**: A hotfix branch. It contains a bug fix that needs to be released immediately.
- **docs**
- **style**: A style branch. It contains style changes (white-space, formatting, missing semi-colons, etc).
- **refactor**: A refactor branch. It contains a code change that neither fixes a bug nor adds a feature.
- ...

> :bulb: If you want more example, you can check types from commit message convention.

# Commit

## Commit message

The commit message should be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit
- **wip**: Work in progress

> :bulb: We can also use the type `setup` for first commits of a project. But normally we no longer need it.

### Breaking changes

All breaking change have to be mentioned with the "!" symbol after the type of the commit message. You can use the "BREAKING CHANGE:" keyword to add a description of the breaking change.

Example:
```
feat!: add new feature
```

or

```
feat(api)!: add new feature

BREAKING CHANGE: new feature breaks something
```

### Scope

The scope could be anything specifying the place of the commit change or just to contextualize the change. So free to use any word you want.

Examples:

- feat(api): add new feature
- feat(auth): add new way to authenticate
- fix(pwa): problem with query
- docs(readme): update readme

# Pull Request

## Title

The title of the pull request should be a short description of the change.

It should follow the commit message convention.

Example:

```
feat(api): add new feature
```

## Description

You don't have to provide a description if the changes are minor.

If there is many changes, please describe the changes in the pull request.

Here is a good example of a good way to describe a pull request in this repository:

```
## <Summary | Fixes | Tests>

[description of the change]
```

## Continous Integration

We use GitHub Actions to test the pull request.

The CI will run build, linting and tests.

You can see the status of the pull request in the GitHub Actions tab (or directly in the pull request).

If the CI fails, you can see the reason in the GitHub Actions tab + you can't merge the pull request.

If the CI succeeds, you are able to merge the pull request.

## Review

In a world where this project is not a solo development school project, the PRs need to be reviewed.

You can ask for a review by adding the "Review Required" label.

If the pull request is valid, you can merge it. If not, you need to fix the problems and ask for a new review.

# Deploy fixes

You can read the [deployment documentation](./docs/deployment.md#deploy-fixes) for more information.
