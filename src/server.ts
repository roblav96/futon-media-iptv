import * as epg from './epg.ts'
import * as m3u from './m3u.ts'
import { errors, isHttpError } from 'https://deno.land/std/http/http_errors.ts'
import { router, HandlerContext } from 'https://deno.land/x/rutt/mod.ts'
import { Status } from 'https://deno.land/std/http/http_status.ts'

const routes = router<Ctx>(
	{
		'/livetv.m3u': async (req, ctx) => {
			const body = (await m3u.get()).m3u
			ctx.headers.set('content-disposition', 'inline; filename="livetv.m3u"')
			ctx.headers.set('content-type', 'audio/mpegurl')
			return new Response(body, { headers: ctx.headers })
		},

		'/utc.lite.xml': async (req, ctx) => {
			const body = await epg.get()
			ctx.headers.set('content-type', 'text/xml')
			return new Response(body, { headers: ctx.headers })
		},

		'/favicon.ico': (req, ctx) => new Response(null, { headers: ctx.headers }),
	},
	{
		errorHandler: (req, ctx, error) => {
			console.error('errorHandler ->', req.method, req.url, error)
			if (isHttpError(error)) {
				return new Response(error.message, {
					status: error.status,
					statusText: error.name,
					headers: ctx.headers,
				})
			}
			return new Response(null, { headers: ctx.headers })
		},
		otherHandler: (req, ctx) => {
			console.warn('otherHandler ->', req.method, req.url)
			return new Response(null, { headers: ctx.headers })
		},
		unknownMethodHandler: (req, ctx) => {
			console.warn('unknownMethodHandler ->', req.method, req.url)
			return new Response(null, { headers: ctx.headers })
		},
	}
)

Deno.serve(
	{
		...(!Deno.env.get('DENO_DEPLOYMENT_ID') && { hostname: '127.0.0.1', port: 18097 }),
	},
	(req, ctx) => {
		Object.assign(ctx, {
			headers: new Headers({
				'access-control-allow-origin': '*',
				'access-control-request-headers': '*',
				'access-control-request-method': '*',
			}),
		})

		if (req.method == 'OPTIONS') {
			return new Response(null, { headers: (ctx as any).headers })
		}

		return routes(req, ctx as any)
	}
)

export type Ctx = {
	headers: Headers
}
export type Handler = (
	req: Request,
	ctx: HandlerContext<Ctx>,
	match: Record<string, string>
) => Response | Promise<Response>
