import * as _ from 'npm:radash'
import * as m3u from './m3u.ts'
import db from './storage.ts'
import { assertExists } from 'https://deno.land/std/testing/asserts.ts'
import { basename } from 'https://deno.land/std/path/mod.ts'
import { js2xml } from 'https://deno.land/x/js2xml/mod.ts'
import { readAll } from 'https://deno.land/std/streams/read_all.ts'
import { readerFromStreamReader } from 'https://deno.land/std/streams/reader_from_stream_reader.ts'
import { xml2js } from 'https://deno.land/x/xml2js/mod.ts'

const EPG_URL = Deno.env.get('EPG_URL')!
assertExists(EPG_URL, `!Deno.env.get('EPG_URL')`)

export async function get({ force = false } = {}) {
	let text = await db.get(import.meta.url)
	if (!text || force == true) {
		// text = await (await fetch(EPG_URL)).text()
		const res = await fetch(EPG_URL)
		assertExists(res.body, '!res.body')
		const stream = res.body.pipeThrough(new DecompressionStream('gzip')).getReader()
		text = new TextDecoder().decode(await readAll(readerFromStreamReader(stream)))
		// console.log('text ->', text)

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
		text = js2xml(js, { compact: true, spaces: 2 })

		db.set(import.meta.url, text)
	}
	return text
}

Deno.cron(_.snake(basename(import.meta.url)), '0 * * * *', () => {
	get({ force: true }).catch((error) => {
		console.error('cron epg force ->', error)
	})
})
