import * as path from 'https://deno.land/std/path/mod.ts'
import * as what from 'https://deno.land/x/is_what/src/index.ts'
import { assertExists } from 'https://deno.land/std/testing/asserts.ts'
import { every15Minute } from 'https://deno.land/x/deno_cron/cron.ts'

export const FILENAME = 'livetv.m3u'

const M3U_URL = Deno.env.get('M3U_URL')!
assertExists(M3U_URL, `!Deno.env.get('M3U_URL')`)

// console.log('localStorage.clear() ->', localStorage.clear())
// console.log('await get() ->', await get())

export async function get() {
	const BASENAME = path.basename(import.meta.url)
	const storage = JSON.parse(localStorage.getItem(BASENAME) ?? '{}') as {
		text: string
		date: number
	}
	if (
		!what.isFullString(storage.text) ||
		(what.isPositiveNumber(storage.date) && storage.date < Date.now())
	) {
		storage.text = await (await fetch(M3U_URL)).text()
		storage.date = Date.now() + new Date(0).setUTCMinutes(14)
		localStorage.setItem(BASENAME, JSON.stringify(storage))
	}

	const EXTINF = '#EXTINF:-1 '
	let lines = storage.text.split(EXTINF)
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

every15Minute(() => get())
