import * as m3u from './m3u.ts'
import * as path from 'https://deno.land/std/path/mod.ts'
import * as what from 'https://deno.land/x/is_what/src/index.ts'
import db from './storage.ts'
import { assertExists } from 'https://deno.land/std/testing/asserts.ts'
import { hourly } from 'https://deno.land/x/deno_cron/cron.ts'
import { js2xml } from 'https://deno.land/x/js2xml/mod.ts'
import { xml2js } from 'https://deno.land/x/xml2js/mod.ts'

const EPG_URL = Deno.env.get('EPG_URL')!
assertExists(EPG_URL, `!Deno.env.get('EPG_URL')`)

export async function get({ force = false } = {}) {
	let text = await db.get(import.meta.url)
	if (!text || force == true) {
		text = await (await fetch(EPG_URL)).text()

		let { tvgids } = await m3u.get()
		let js = xml2js(text, { compact: true }) as any
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

hourly(() => {
	get({ force: true }).catch((error) => {
		console.error('hourly epg force ->', error)
	})
})
