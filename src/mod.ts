import * as http from 'https://deno.land/std/http/mod.ts'
import * as m3u from './m3u.ts'

for (let envkey of ['EPG_URL', 'M3U_URL']) {
	if (!Deno.env.get(envkey)) {
		throw new Error(`Missing ${envkey} environment variable!`)
	}
}

const server = http.serve({ hostname: '127.0.0.1', port: 8080 })
for await (let request of server) {
	console.log('request ->', request)
	if (request.url == '/get_m3u') {
		let response = await m3u.get(request)
		response.headers.delete('content-length')
		console.log('response.headers ->', response.headers)
		request.respond(response)
		// request.respond(await m3u.get())
	}
}
