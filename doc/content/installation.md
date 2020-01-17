---
weight: 10
title: Installation
---

# Installation

## Set up a GitHub Actions workflow

The TypeScript Action is bundled and distributed as a single JavaScript file in a

> A minimal YAML workflow file:

```yml
name: 'issue?'
on:
  issues:
    types: [ opened, edited ]
jobs:
  mwe:
    runs-on: ubuntu-latest
    steps:
    - uses: eine/issue-runner@gha-v1
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        allow-host: false
```

- https://octokit.github.io/rest.js/
- https://github.com/actions/toolkit/tree/master/packages/github
- https://github.com/features/actions
- https://github.com/actions/typescript-action

## CLI tool

The CLI tool is a static binary written in golang, which can optionally use `docker`. It can be downloaded from [github.com/eine/issue-runner/releases](https://github.com/eine/issue-runner/releases), or it can be built from sources.

```sh
git clone https://github.com/eine/issue-runner
cd tool
go build -o issue-runner
```

<!--
```sh
curl -L https://raw.githubusercontent.com/eine/issue-runner/master/tool/get.sh | sh -
```

> You can give it a try at [play-with-docker.com](https://labs.play-with-docker.com/). Just create a node and run the command above.
-->
