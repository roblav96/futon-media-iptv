import * as fs from 'https://deno.land/std/fs/mod.ts'
import * as http from 'https://deno.land/std/http/mod.ts'
import * as io from 'https://deno.land/std/io/mod.ts'
import * as path from 'https://deno.land/std/path/mod.ts'
import * as scanner from 'https://deno.land/x/scanner/mod.ts'

export async function get(request: http.ServerRequest) {
	let response = await fetch(Deno.env.get('M3U_URL') as string)
	console.log('response ->', response)
	let lines = (await response.text()).split('\n')
	for (let i = 0; i < lines.length; i++) {
		let line = lines[i]
		if (line.includes('LATINO: ')) {
			console.log('line ->', line)
			lines.splice(i, 2)
			i = i - 2
		}
	}
	// console.log('lines ->', lines)
	return {
		body: lines.join('\n'),
		headers: response.headers,
		status: response.status,
	}
	// console.log('text ->', text)
	// return text
}
