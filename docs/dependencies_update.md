## Automated dependency updates

To update our project, we use Renovate. This allows us to automatically retrieve the list of dependencies that need to be updated and prepare a pull request ready for merging.

Every **Monday at 6:00 AM**, Renovate performs a check and creates (or updates) a PR updating the dependencies. On Monday morning, the lead developer must review the PR's contents and see if everything is in order.

If not, then on the last Monday of the month, the developers dedicate time to resolve the issue to avoid updating a broken dependency.
The advantage of our update process is that it is semi-automated, allowing developers to maintain control over updates while making their work easier.

## Manual dependency updates

In case everything is not working as expected, the lead developer can manually update the dependencies.

The process is as follows:

1. Check the dependencies that need to be updated and seem to be problematic in the automated process.
2. Try to update the dependencies manually.
3. If the dependencies work as expected, then merge the Renovate PR.
4. If the dependencies don't work as expected, then find why they don't work and fix the issue.
5. If the issue is always not fixed, then don't update the problematic dependency by changing the Renovate PR.
