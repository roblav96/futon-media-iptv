import * as _ from 'npm:radash'
import db from './storage.ts'
import { assertExists } from 'https://deno.land/std/testing/asserts.ts'
import { basename } from 'https://deno.land/std/path/basename.ts'

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
	const extm3u = lines.shift()!
	lines = _.unique(lines, (line) => line.split('\n')[1])
	lines = lines.filter((line) => {
		if (line.includes('group-title="US"')) return true
		if (line.includes('group-title="Sports')) return true
	})

	const tvgids = lines.map((v) => v.match(/tvg-id="(\S+)"/)![1]).filter(Boolean)
	const m3u = [extm3u, ...lines].join(EXTINF)
	return { tvgids, m3u }
}

Deno.cron(_.snake(basename(import.meta.url)), '*/15 * * * *', () => {
	get({ force: true }).catch((error) => {
		console.error('cron m3u force ->', error)
	})
})
