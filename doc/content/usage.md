---
weight: 11
title: Usage
---

# Usage

## Supported markdown syntax

> Language definition string containing `:file:.*`:

~~~md
```sh :file: hello.sh
#!/usr/bin/env sh
echo "Hello world!"
```
~~~

> Body containing `:file:.*` as a comment (that depends on the target language):

~~~md
```sh
#!/usr/bin/env sh
echo "Hello world!"
#:file: hello.sh
```
~~~

> External files with the name to the reference matching `:mwe:.*`:

~~~md
[:mwe:filename.ext.txt](URL)
[:mwe:filename.tar.gz](URL)
~~~

**issue-runner** scans the (markdown) body to extract:

- Decorated code blocks.
- Attached/linked files.

<aside class="notice">
Since GitHub allows uploading files with a limited set of extensions, issue-runner expects the user to append <code>.txt</code> to attached source filenames. This extra extension is trimmed.

The exception are tarballs, zipfiles or txt files. No extra extension needs to be appended. The content of these is automatically extracted.
</aside>

## Entrypoint

> Language definition string containing `:image:.*`

~~~md
```sh :image: debian:buster-slim
echo "Hello world!"
```
~~~

> Body containing :image:.* as a comment (that depends on the target language):

~~~md
```py
#!/usr/bin/env python3

print('Hello world!')

#:image: python:slim-buster
```
~~~

One, and only one, of the code blocks should contain `:image:.*` instead of `:file:.*`. That file will be the entrypoint to an OCI container.

<aside class="notice">
To execute the MWE in multiple images, provide a space separated list. For example: <code>:image: alpine ghdl/ghdl:buster-mcode ubuntu:19.04</code>.
</aside>

Alternatively, if no `:image:` is defined, the file which is named `run` will be used as the entrypoint to execute the MWE on the host.

## CLI

{{% aside notice %}}Features to automatically label/comment the issues are not included in the CLI tool. These features are implemented in the GitHub Action only.{{% /aside %}}

> Providing a list of identifiers is supported:

```sh
issue-runner 'tests/md/vunit-sh.md' 'VUnit/vunit#337' 'ghdl/ghdl#579'
# or
issue-runner 'ghdl/ghdl#584' 'https://raw.githubusercontent.com/eine/issue-runner/master/tests/md/vunit-py.md'
```

At least one of the following references needs to be provided:

- Path or URL to markdown file: `issue-runner path/to/markdown/file.md`
- Full URL to a GitHub issue: `issue-runner 'https://github.com/user/repo/issues/number'`
- Short reference of a GitHub issue (see [GitHub Help: Autolinked references and URLs](https://help.github.com/articles/autolinked-references-and-urls/#issues-and-pull-requests)): `issue-runner 'user/repo#number'`

<aside class="notice">
Multiple references can be managed as a single MWE with flag <code>-m|--merge</code>.
</aside>

> MWEs defined in a single file/body can be read through *stdin*:

```sh
cat ./tests/md/hello001.md | ./issue-runner -
# or
./issue-runner -y - < ./tests/md/hello003.md
```

### Docker container

Instead of installing issue-runner on the host, the CLI tool can be used as a container. In this context, execution on the *host* refers to executing the MWEs in the same container. Running sibling containers is supported too; however, it requires a named volume (`issues:/volume`) and the socket of the daemon to be bind.

> Execution of MWEs on sibling containers:

```sh
docker run --rm \
  -v //var/run/docker.sock://var/run/docker.sock \
  -v issues://volume \
  eine/issue-runner <ref>
```
