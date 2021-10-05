#!/usr/bin/env just --justfile
# https://github.com/casey/just

set shell := ["bash", "-uc"]
set dotenv-load := true

_default :
	@just --dump

lint :
	deno lint --unstable src/*.ts

run :
	@deno cache --unstable --no-check src/mod.ts || true
	deno run --unstable --no-check --allow-all src/mod.ts
watch :
	watchexec --restart -- 'printf "\ec\e[3J"; just run'

daemon_path := "$HOME/.daemonize/futon-media-iptv"
stop :
	if [[ ! -e "{{daemon_path}}.pid" ]]; then exit 1; fi
	kill -SIGTERM -$(cat "{{daemon_path}}.pid")
	rm -v "{{daemon_path}}.pid"
alias restart := start
start :
	if [[ -e "{{daemon_path}}.pid" ]]; then just stop; fi
	daemonize -c "{{justfile_directory()}}" -e "{{daemon_path}}.log" -o "{{daemon_path}}.log" -a -p "{{daemon_path}}.pid" -l "{{daemon_path}}.pid" -- /usr/bin/env just run
	just logs 0
logs lines="100" :
	tail -f -n {{lines}} "{{daemon_path}}.log"

#

# export DENO_DIR := justfile_directory() + "/node_modules/.cache/deno"
# install :
# 	rm -r -f node_modules
# 	mkdir -p node_modules/.cache/deno
# 	deno types --unstable > "$DENO_DIR/lib.deno.d.ts"
# 	deno types --unstable > "$DENO_DIR/lib.deno.unstable.d.ts"
# 	deno cache --unstable --reload src/mod.ts
# # ln -s "$DENO_DIR" node_modules/.cache/deno
