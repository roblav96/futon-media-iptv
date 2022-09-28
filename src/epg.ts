import * as m3u from './m3u.ts'
import * as path from 'https://deno.land/std/path/mod.ts'
import * as what from 'https://deno.land/x/is_what/src/index.ts'
import { assertExists } from 'https://deno.land/std/testing/asserts.ts'
import { hourly } from 'https://deno.land/x/deno_cron/cron.ts'
import { js2xml } from 'https://deno.land/x/js2xml/mod.ts'
import { readAll, readerFromStreamReader } from 'https://deno.land/std/streams/conversion.ts'
import { xml2js } from 'https://deno.land/x/xml2js/mod.ts'

export const FILENAME = 'utc.lite.xml'

const EPG_URL = Deno.env.get('EPG_URL')!
assertExists(EPG_URL, `!Deno.env.get('EPG_URL')`)

// console.log('localStorage.clear() ->', localStorage.clear())
// console.log('await get() ->', await get())

export async function get() {
	const BASENAME = path.basename(import.meta.url)
	const storage = JSON.parse(localStorage.getItem(BASENAME) ?? '{}') as {
		text: string
		date: number
	}
	if (
		what.isFullString(storage.text) &&
		what.isPositiveNumber(storage.date) &&
		storage.date > Date.now()
	) {
		return storage.text
	}

	const res = await fetch(EPG_URL)
	assertExists(res.body, '!res.body')
	const stream = res.body.pipeThrough(new DecompressionStream('gzip')).getReader()
	const text = new TextDecoder().decode(await readAll(readerFromStreamReader(stream)))

	const { tvgids } = await m3u.get()
	const js = xml2js(text, { compact: true }) as any
	js.tv.channel = js.tv.channel.filter((v: any) => {
		return tvgids.includes(v._attributes.id)
	})
	// console.log('js.tv.channel ->', js.tv.channel)
	js.tv.programme = js.tv.programme.filter((v: any) => {
		return tvgids.includes(v._attributes.channel)
	})
	// console.log('js.tv.programme ->', js.tv.programme)

	storage.text = js2xml(js, { compact: true, spaces: 2 })
	storage.date = Date.now() + new Date(0).setUTCMinutes(59)
	localStorage.removeItem(BASENAME)
	localStorage.setItem(BASENAME, JSON.stringify(storage))
	return storage.text
}

hourly(() => get())
