#!/usr/bin/env sh

docker run --rm -itv /$(pwd)://src -w //src -p 5000:5000 node bash -c "
curl -fsSL https://dl.google.com/go/go1.13.4.linux-amd64.tar.gz | tar -xzf - -C /usr/local
export PATH=\$PATH:/usr/local/go/bin
curl -fsSL https://github.com/gohugoio/hugo/releases/download/v0.62.2/hugo_extended_0.62.2_Linux-64bit.tar.gz | tar xzf - -C /usr/local/bin hugo
bash
"

# ./hugo/hugo serve --bind 0.0.0.0 -p 5000
