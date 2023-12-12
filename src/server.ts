import * as epg from './epg.ts'
import * as m3u from './m3u.ts'
import { router, HandlerContext } from 'https://deno.land/x/rutt/mod.ts'
import { STATUS_CODE, STATUS_TEXT } from 'https://deno.land/std/http/status.ts'

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
		errorHandler: (req, ctx, error: any) => {
			console.error('errorHandler ->', req.method, req.url, error)
			return new Response(error?.message ?? null, {
				headers: ctx.headers,
				status: STATUS_CODE.InternalServerError,
			})
		},
		otherHandler: (req, ctx) => {
			console.warn('otherHandler ->', req.method, req.url)
			return new Response(null, {
				headers: ctx.headers,
				status: STATUS_CODE.NotFound,
			})
		},
	},
)

Deno.serve(
	{
		...(!Deno.env.get('DENO_DEPLOYMENT_ID') && { hostname: '127.0.0.1', port: 56167 }),
	},
	(req, ctx) => {
		Object.assign(ctx, {
			headers: new Headers({
				'access-control-allow-headers': '*',
				'access-control-allow-methods': '*',
				'access-control-allow-origin': '*',
			}),
		} as Ctx)

		if (req.method == 'OPTIONS') {
			return new Response(null, {
				headers: (ctx as any).headers,
				status: STATUS_CODE.NoContent,
			})
		}

		return routes(req, ctx as any)
	},
)

export type Ctx = {
	headers: Headers
}
export type Handler = (
	req: Request,
	ctx: HandlerContext<Ctx>,
	match: Record<string, string>,
) => Response | Promise<Response>
