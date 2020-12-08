import './console.ts'
import * as http from 'https://deno.land/std/http/mod.ts'
import * as m3u from './m3u.ts'

for (let envkey of ['EPG_URL', 'M3U_URL']) {
    if (!Deno.env.get(envkey)) {
        throw new Error(`Missing ${envkey} environment variable!`)
    }
}

const server = http.serve('127.0.0.1:8080')
;(async function main() {
    for await (let request of server) {
        if (request.url == '/get_m3u') {
            request.respond(await m3u.get(request))
        }
    }
})().catch((error) => console.error('main catch -> %O', error))
