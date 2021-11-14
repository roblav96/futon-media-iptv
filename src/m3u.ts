import * as http from 'https://deno.land/std/http/mod.ts'

for (let envkey of ['M3U_URL']) {
	if (!Deno.env.get(envkey)) {
		throw new Error(`Undefined ${envkey} environment variable!`)
	}
}
const M3U_URL = Deno.env.get('M3U_URL')!

const GROUPS = [
	'MLB',
	'NBA League Pass',
	'NFL',
	'NHL',
	'PPV',
	'Supersport',
	'United Kingdom Club Football',
	'United Kingdom Sports',
	'US MLB',
	'US NBA',
	'US NFL',
	'US Sports',
	'USA FHD',
	'Xfinity',
]
// console.log('GROUPS ->', GROUPS)

// localStorage.clear()

export async function get(request: Request) {
	let lskeys = Array.from(Array(localStorage.length), (v, i) => localStorage.key(i)!)
	let lskey = lskeys.find((v) => parseInt(v) > Date.now())!
	let text = localStorage.getItem(lskey)
	if (!text) {
		text = await (await fetch(M3U_URL)).text()
		localStorage.clear()
		localStorage.setItem(`${Date.now() + new Date(0).setUTCMinutes(60)}`, text)
	}

	const EXTINF = '#EXTINF:-1 '
	let lines = text.split(EXTINF)
	let extm3u = lines.shift()!
	let groups = GROUPS.map((v) => `group-title="${v}"`)
	lines = lines.filter((line) => {
		if (line.includes('Latin') || line.includes(' (ES)')) return
		if (line.includes(' SD') || line.includes(' (SD)')) return
		return groups.find((v) => line.includes(v))
	})

	return new Response([extm3u, ...lines].join(EXTINF), {
		headers: new Headers({
			'content-type': 'application/x-mpegURL',
		}),
	})
}
