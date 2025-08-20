## Production and Staging Environments

This project has two environments. The first is the staging environment, which allows us to run our various tests before going live. The second is the production environment.

The staging and production environments are deployed on two separate dedicated servers on which we have Dokploy instances.

The staging environment is deployed on a dedicated server on which we have other staging environments for other projects, while the production instance is installed on a server dedicated to kinL. Using the same deployment tool ensures that the environments are ISO-compliant between staging and production, which avoids unforeseen bugs.

Since we use trunk-based development, we only have one `main` branch. Therefore, the staging environment is based on the `main` branch, while the production environment is based on the releases (with each release, we trigger a webhook via Github Actions).

## How to deploy

We have a complete continuous deployment process in place within the application.

During development, once a feature has passed the continuous integration process, we can merge the feature into the `main` branch. In this case, there's nothing for the developer to do, as new commits on the `main` branch are detected and trigger a new deployment to the staging environment.

This merge into the `main` branch triggers the creation of a Release Pull Request. Once the version is ready and thoroughly tested with the staging environment, you simply merge this pull request directly into the `main` branch, which triggers the creation of a release, the deployment of the Docker image, and the deployment of the production environment.

## Deploy fixes

Deploying a hotfix is done in the same way as deploying a feature to production. Except that instead of basing the fix on the main branch, it's based on the tag commit of the version you want to fix.

To deploy an emergency hotfix, you need to create a `hotfix/<version>` branch (replace "version" with the version number you want to fix) and create smaller hotfix branches based on this hotfix branch to keep track of what you've changed and to go through the continuous integration process.

Once the hotfix has passed the continuous integration tests, you can now merge the fix into the hotfix branch. The hotfix branch will have a release pull request automatically created by our continuous deployment system. Of course, you must verify that the fix doesn't cause a regression and actually fixes the detected issue by using a second staging environment, which is only activated when needed to save resources.

Once tested, simply merge the release pull request, which creates a new, fixed version and deploys the version to the production environment.
