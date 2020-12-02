#!/usr/bin/env just --justfile
# https://github.com/casey/just

set shell := ["/usr/bin/env", "bash", "-c"]

export DENO_DIR := justfile_directory() + "/node_modules/.cache/deno"

install :
	rm -r -f node_modules
	mkdir -p -v "${DENO_DIR}"
	deno types --unstable > "$DENO_DIR/lib.deno.d.ts"
	deno cache --config tsconfig.json --unstable --reload src/mod.ts

clear := ""
run :
	echo "{{clear}}"
	echo '{{clear}}'
	@ if test -n "{{clear}}"; then printf "\ec\e[3J"; fi
	deno run --config tsconfig.json --unstable --allow-all --no-check src/mod.ts
# if {{clear}} == "true"; then printf "\ec\e[3J"; fi
watch :
	watchexec --restart -- just clear=true run
