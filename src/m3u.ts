import * as http from 'https://deno.land/std/http/mod.ts'

export async function get(request: http.ServerRequest) {
	request.headers.delete('connection')
	console.log('request.headers.keys() ->', request.headers.keys())
	let response = await fetch(Deno.env.get('M3U_URL') as string, {
		headers: request.headers,
	})
	let lines = (await response.text()).split('\n')
	for (let i = 0; i < lines.length; i++) {
		let line = lines[i]
		if (line.includes('LATINO: ')) {
			lines.splice(i, 2)
			i = i - 2
		}
	}
	response.headers.delete('content-length')
	return {
		body: lines.join('\n'),
		headers: response.headers,
		status: response.status,
	} as http.Response
}
