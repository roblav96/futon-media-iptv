#!/usr/bin/env just --justfile
# https://github.com/casey/just

# set dotenv-load
set shell := ["bash", "-uc"]

_default :
	@just --dump



install:
	deno cache --unstable --no-check --reload src/*.ts

run main:
	@echo "█ "
	-@setsid --fork deno cache --unstable --no-check src/*.ts
	-@setsid --fork deno check --unstable --quiet {{main}}
	-@deno run --unstable --no-check --allow-all {{main}}
watch main:
	watchexec --no-project-ignore --clear --restart --shell=none --watch=src --exts=ts -- just run {{main}}



daemon_path := "$HOME/.daemonize/futon-media-iptv"
stop :
	if [[ ! -e "{{daemon_path}}.pid" ]]; then exit 1; fi
	kill -SIGTERM -$(cat "{{daemon_path}}.pid")
	rm -v "{{daemon_path}}.pid"
alias restart := start
start :
	if [[ -e "{{daemon_path}}.pid" ]]; then just stop; fi
	daemonize -c "{{justfile_directory()}}" -e "{{daemon_path}}.log" -o "{{daemon_path}}.log" -a -p "{{daemon_path}}.pid" -l "{{daemon_path}}.pid" -- /usr/bin/env deno run --unstable --no-check --allow-all src/mod.ts
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
