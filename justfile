#!/usr/bin/env just --justfile
# https://github.com/casey/just

set shell := ["/usr/bin/env", "bash", "-c"]

export DENO_DIR := justfile_directory() + "/node_modules/.cache/deno"

install :
	rm -r -f node_modules
	mkdir -p "$DENO_DIR"
	deno types --unstable > "$DENO_DIR/lib.deno.d.ts"
	deno cache --config tsconfig.json --unstable --reload --quiet src/mod.ts

lint :
	deno lint --unstable src/mod.ts

run :
	deno run --config tsconfig.json --unstable --allow-all --no-check src/mod.ts

watch :
	watchexec --restart -- 'printf "\ec\e[3J"; just run'

stop :
	if [ -e "$HOME/.daemonize/futon-media-iptv.pid" ]; then kill -SIGTERM $(cat "$HOME/.daemonize/futon-media-iptv.pid"); fi
start :
	just stop
	daemonize -c {{justfile_directory()}} -e "$HOME/.daemonize/futon-media-iptv.log" -o "$HOME/.daemonize/futon-media-iptv.log" -a -p "$HOME/.daemonize/futon-media-iptv.pid" -l "$HOME/.daemonize/futon-media-iptv.pid" -- just run
