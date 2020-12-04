#!/usr/bin/env just --justfile
# https://github.com/casey/just

set shell := ["bash", "-cu"]

# export DENO_DIR := justfile_directory() + "/node_modules/.cache/deno"
# deno types --unstable > "$DENO_DIR/lib.deno.d.ts"

install :
	rm -r -f node_modules
	mkdir -p node_modules/.cache
	ln -s "$DENO_DIR" node_modules/.cache/deno
	deno cache --unstable --reload --quiet src/mod.ts

run :
	-deno lint --unstable src/mod.ts
	-deno cache --unstable src/mod.ts
	deno run --unstable --allow-all --cached-only --no-check src/mod.ts

watch :
	watchexec --restart -- 'printf "\ec\e[3J"; just run'

stop :
	if [ ! -e "$HOME/.daemonize/futon-media-iptv.pid" ]; then exit 1; fi
	kill -SIGTERM -$(cat "$HOME/.daemonize/futon-media-iptv.pid")
	rm -v "$HOME/.daemonize/futon-media-iptv.pid"

start :
	if [ -e "$HOME/.daemonize/futon-media-iptv.pid" ]; then just stop; fi
	daemonize -c {{justfile_directory()}} -e "$HOME/.daemonize/futon-media-iptv.log" -o "$HOME/.daemonize/futon-media-iptv.log" -a -p "$HOME/.daemonize/futon-media-iptv.pid" -l "$HOME/.daemonize/futon-media-iptv.pid" -- /usr/bin/env just run
	just logs 0

logs lines='100' :
	tail -f -n {{lines}} "$HOME/.daemonize/futon-media-iptv.log"
