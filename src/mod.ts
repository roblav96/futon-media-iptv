import './console.ts'

import 'https://deno.land/std/dotenv/load.ts'

import * as epg from './epg.ts'
import * as m3u from './m3u.ts'
import * as server from './server.ts'

queueMicrotask(async function start() {
    try {
        // ;(await import('./storage.ts')).db.clear()
        // await m3u.get({ force: true })
        // await epg.get({ force: true })
    } catch (error) {
        console.error('start force get ->', error)
        Deno.exit(1)
    }
    server.serve()
    console.time('fetch')
    const response = await fetch('http://127.0.0.1:18097/utc.lite.xml')
    console.timeEnd('fetch')
    console.time('response.text')
    await response.text()
    // console.log('await response.text() ->', await response.text())
    console.timeEnd('response.text')
})
