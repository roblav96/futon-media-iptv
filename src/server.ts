import * as http from 'https://deno.land/std/http/mod.ts'
import * as m3u from './m3u.ts'

http.serve(
	async (request) => {
		try {
			let url = new URL(request.url)
			if (url.pathname.endsWith(m3u.PATHNAME)) {
				return await m3u.get(request)
			}
		} catch (error) {
			console.error('request -> %O', error)
			return new Response(error.toString(), {
				status: http.Status.InternalServerError,
			})
		}
		return new Response(http.STATUS_TEXT.get(http.Status.NotFound), {
			status: http.Status.NotFound,
		})
	},
	{ addr: '127.0.0.1:18097' },
)
