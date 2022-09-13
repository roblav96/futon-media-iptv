import * as epg from './epg.ts'
import * as http from 'https://deno.land/std/http/mod.ts'
import * as m3u from './m3u.ts'

console.log('localStorage.clear() ->', localStorage.clear())

http.serve(
	async (request) => {
		try {
			let url = new URL(request.url)
			if (url.pathname.endsWith(m3u.FILENAME)) {
				return new Response((await m3u.get()).m3u, {
					headers: new Headers({
						'content-disposition': `inline; filename="${m3u.FILENAME}"`,
						'content-type': 'audio/mpegurl',
					}),
				})
			}
			if (url.pathname.endsWith(epg.FILENAME)) {
				return new Response(await epg.get(), {
					headers: new Headers({
						'content-type': 'text/xml',
					}),
				})
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
	},
	{ hostname: '127.0.0.1', port: 18097 },
)
