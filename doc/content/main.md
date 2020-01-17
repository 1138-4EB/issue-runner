---
weight: 1
---

# Introduction

Welcome to the documentation of **issue-runner**, a toolkit to retrive, set up and run reproducible examples ([MWE](https://en.wikipedia.org/wiki/Minimal_working_example), [MCVE](https://stackoverflow.com/help/minimal-reproducible-example)).

**issue-runner** supports MWEs defined in [Markdown](https://en.wikipedia.org/wiki/Markdown) files (such as the first comment in a GitHub issue); external tarball(s)/zipfile(s)/file(s) can be included. It extracts sources to separate files, (optionally) invokes docker, executes the entrypoint, (optionally) cleans up and exits with a meaningful error code.

As a complement, a TypeScript Action for GitHub Actions (GHA) is provided, which allows to easily integrate the tool in (scheduled) GHA YAML workflows.
