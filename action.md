**issue-runner action** is a bundled TypeScript CLI tool to be used standalone or in a GitHub Actions workflow.

## Triage single issue on creation/edition

## Triage all the issues in a repo

## Execute all the issues in a repo


Note that `with` parameters are both optional:

-   `token` is required to report feedback (labelling issues or adding comments automatically).
-   `allow-host` enables/disables running scripts on the host (without a container). For security reasons, this is discouraged and this parameter defaults to `false`.


The main use case for this toolkit is to be added to a GitHub Actions (GHA) workflow in order to monitor the issues in a repository and optionally report status/results by:

- labelling issues as `reproducible` or `fixed?`,
- adding a comment to the issue with logs and/or refs to jobs/artifacts,
- and/or making test artifacts available through a CI job

Nonetheless, the CLI tool can also be used to set up and test any MWE or issue locally.