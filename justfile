#!/usr/bin/env just --justfile
# https://github.com/casey/just

set shell := ["/usr/bin/env", "bash", "-c"]

export DENO_DIR := justfile_directory() + "/node_modules/.cache/deno"
# export DENO_DIR := `echo "$PWD/node_modules/.cache/deno"`
# export DENO_DIR := `echo "${DENO_DIR:-$PWD/node_modules/.cache/deno}"`

install :
	rm -r -f node_modules
	mkdir -p -v "$DENO_DIR"
	deno types --unstable > "$DENO_DIR/lib.deno.d.ts"
	deno cache --config tsconfig.json --unstable --reload src/mod.ts

run :
	deno run --config tsconfig.json --unstable --allow-all --no-check src/mod.ts
watch :
	watchexec --restart -- 'printf "\ec\e[3J"; just run'
