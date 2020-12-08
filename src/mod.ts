import './console.ts'
import * as http from 'https://deno.land/std/http/mod.ts'
import * as m3u from './m3u.ts'

for (let envkey of ['EPG_URL', 'M3U_URL']) {
    if (!Deno.env.get(envkey)) {
        throw new Error(`Missing ${envkey} environment variable!`)
    }
}

let t = performance.now()
const server = http.serve('127.0.0.1:8080')
console.log('server ->', server)
;(async function main() {
    console.log('server.listener ->', server.listener)
    console.log(performance.now() - t, 'performance.now')
    for await (let request of server) {
        console.log('request.url ->', request.url)
        if (request.url == '/get_m3u') {
            request.respond(await m3u.get(request))
        }
    }
})()
console.log('Deno.cwd() ->', Deno.cwd())
