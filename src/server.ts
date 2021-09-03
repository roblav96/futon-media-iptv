import * as http from 'https://deno.land/std/http/mod.ts'
import * as m3u from './m3u.ts'

const server = http.serve('127.0.0.1:18097')
for await (let request of server) {
	try {
		if (request.url == '/iptv.m3u8') {
			await request.respond(await m3u.get(request))
		}
	} catch (error) {
		console.error('request -> %O', error)
		await request.respond({
			body: error.toString(),
			status: http.Status.InternalServerError,
		})
	}
}
