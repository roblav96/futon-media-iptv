import * as http from 'https://deno.land/std/http/mod.ts'

for (let envkey of ['M3U_URL']) {
	if (!Deno.env.get(envkey)) {
		throw new Error(`Undefined ${envkey} environment variable!`)
	}
}

export async function get(request: Request) {
	let headers = new Headers(request.headers)
	headers.delete('connection')
	let response = await fetch(Deno.env.get('M3U_URL') as string, { headers })
	let lines = ((await response.text()) ?? '').split('\n')
	for (let i = 0; i < lines.length; i++) {
		let line = lines[i]
		if (line.includes('Latin') || line.includes('PT ') || line.includes(' SD')) {
			lines.splice(i, 2)
			i = i - 2
		}
	}
	headers = new Headers(response.headers)
	headers.delete('alt-svc')
	headers.delete('content-length')
	headers.set('content-type', 'application/x-mpegURL')
	return new Response(lines.join('\n'), {
		headers,
		status: response.status,
	})
}
