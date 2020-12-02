import * as Fae from 'https://deno.land/x/fae/mod.ts'
import * as fs from 'https://deno.land/std/fs/mod.ts'
import * as http from 'https://deno.land/std/http/mod.ts'
import * as log from 'https://deno.land/std/log/mod.ts'
import * as p2r from 'https://deno.land/x/path_to_regexp/index.ts'
import * as path from 'https://deno.land/std/path/mod.ts'
import * as io from 'https://deno.land/std/io/mod.ts'

const { EPG_URL, M3U_URL } = Deno.env.toObject()
let response = await fetch(M3U_URL)
console.log('response ->', response)
if (response.body) {
	let text = await response.text()
	console.log('text ->', text)
	// let reader = response.json
	// let iter = io.BufReader.create(reader).readLine
	// // let delim = /(?:\r?\n)/g
	// for await (let Array of io.BufReader.create(response.body.getReader()).readFull()) {

	// }
	// // console.log('response ->', response.body.getReader())
}

const server = http.serve({ hostname: '127.0.0.1', port: 8080 })
for await (const request of server) {
	console.log('request ->', request)
}

async function get_m3u() {

}
