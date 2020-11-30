#!/usr/bin/env just --justfile
# https://github.com/casey/just

set shell := ["/usr/bin/env", "bash", "-c"]

init-dev :
	rm -r -f -v node_modules
	mkdir -p -v node_modules/.cache
	ln -s -f -v $DENO_DIR node_modules/.cache/deno

cache :
	deno cache --config tsconfig.json --unstable --no-check src/mod.ts
watch-cache :
	watchexec -- just cache

run :
	deno run --config tsconfig.json --unstable --allow-all --no-check src/mod.ts
watch-run :
	watchexec --restart -- 'tput clear; just run'
