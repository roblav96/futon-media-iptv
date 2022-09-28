import * as epg from './epg.ts'
import * as what from 'https://deno.land/x/is_what/src/index.ts'
import * as http from 'https://deno.land/std/http/mod.ts'
import * as m3u from './m3u.ts'

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

// export function serve() {
	Deno.serve({ hostname: '127.0.0.1', port: 18097 }, async (request) => {
		try {
			console.info('request ->', request.url)
			let pathname = new URL(request.url).pathname
			let handler = ROUTES[pathname]
			if (typeof handler == 'function') {
			}
			for (let [route, handler] of Object.entries(ROUTES)) {
				if (pathname.endsWith(route)) {
					console.warn('pathname.endsWith ->')
					return await handler(request)
				}
			}
		} catch (error) {
			console.error('http.serve request -> %O', error)
			return new Response(error.toString(), {
				status: http.Status.InternalServerError,
			})
		}
		return new Response(http.STATUS_TEXT[http.Status.NotFound], {
			status: http.Status.NotFound,
		})
	})
// }
