import * as epg from './epg.ts'
import * as http from 'https://deno.land/std/http/mod.ts'
import * as m3u from './m3u.ts'
import * as what from 'https://deno.land/x/is_what/src/index.ts'

const ROUTES = {
	'/livetv.m3u': async (request) => {
		return new Response((await m3u.get()).m3u, {
			headers: new Headers({
				'content-disposition': 'inline; filename="livetv.m3u"',
				'content-type': 'audio/mpegurl',
			}),
		})
	},
	'/utc.lite.xml': async (request) => {
		return new Response(await epg.get(), {
			headers: new Headers({
				'content-type': 'text/xml',
			}),
		})
	},
} as Record<string, Deno.ServeHandler>

http.serve(
	async (request) => {
		try {
			console.log('request ->', request.url)
			let handler = ROUTES[new URL(request.url).pathname]
			if (what.getType(handler) == 'AsyncFunction') {
				return await handler(request)
			}
			if (what.getType(handler) == 'Function') {
				return handler(request)
			}
			return new Response(http.STATUS_TEXT[http.Status.NotFound], {
				status: http.Status.NotFound,
			})
		} catch (error) {
			console.error('http.serve request -> %O', error)
			return new Response(error.toString(), {
				status: http.Status.InternalServerError,
			})
		}
	},
	{ hostname: '127.0.0.1', port: 18097 },
)
