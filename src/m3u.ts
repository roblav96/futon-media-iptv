import * as path from 'https://deno.land/std/path/mod.ts'
import * as what from 'https://deno.land/x/is_what/src/index.ts'
import db from './storage.ts'
import { assertExists } from 'https://deno.land/std/testing/asserts.ts'
import { every15Minute } from 'https://deno.land/x/deno_cron/cron.ts'

const M3U_URL = Deno.env.get('M3U_URL')!
assertExists(M3U_URL, `!Deno.env.get('M3U_URL')`)

export async function get({ force = false } = {}) {
	let text = await db.get(import.meta.url)
	if (!text || force == true) {
		text = await (await fetch(M3U_URL)).text()
		db.set(import.meta.url, text)
	}

	const EXTINF = '#EXTINF:-1 '
	let lines = text.split(EXTINF)
	let extm3u = lines.shift()!
	lines = lines.filter((line) => {
		if (line.includes('group-title="US"')) return true
		if (line.includes('group-title="Sports')) return true
	})

	return {
		tvgids: lines.map((v) => v.match(/tvg-id="(\S+)"/)![1]).filter(Boolean),
		m3u: [extm3u, ...lines].join(EXTINF),
	}
}

every15Minute(() => {
	get({ force: true }).catch((error) => {
		console.error('every15Minute m3u force ->', error)
	})
})
