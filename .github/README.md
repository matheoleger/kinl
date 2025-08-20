## Github Actions

We have 3 Github Actions:

- [CI](../.github/workflows/ci.yaml): This action is triggered on every PR to the `main` branch. It runs the tests and checks the code quality and build the Docker image and the project to make sure it works.
- [Release Please](../.github/workflows/release-pr.yaml): This action is triggered when a new commit is pushed to the `main` branch (so when a PR is merged). It creates a new release based on the commit message. In this Release PR, you can see the updated changelog, the release notes and the updated version number in the `package.json` files from all the packages (API, PWA, Codegen API and root package.json).
- [CD](../.github/workflows/cd.yaml): This action is triggered when a new tag is pushed to the repository. It builds the Docker image, pushes it to the Docker Hub, and deploys the application to the staging and production environments on Dokploy.

Each actions is important for the CI/CD process.

## Release

We have a `release.yaml` file that use to create Changelog and Release documentation.

### Changelog

The [CHANGELOG.md](../CHANGELOG.md) file is maintened with Release please.

## Renovate

We use Renovate to automatically update the dependencies. You can find the configuration file [here](../.github/renovate.json).

Find more about our dependency update process [here](../docs/dependencies_update.md).
