import './console.ts'
import 'https://deno.land/std/dotenv/load.ts'

import * as epg from './epg.ts'
import * as m3u from './m3u.ts'
import db from './storage.ts'

await db.clear()
await m3u.get({ force: true })
await epg.get({ force: true })
await import('./server.ts')

if (Deno.env.get('NODE_ENV') == 'development') {
	queueMicrotask(() => import('./mod_test.ts'))
}
