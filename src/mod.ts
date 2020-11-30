import * as Fae from 'https://deno.land/x/fae/mod.ts'
import * as fs from 'https://deno.land/std/fs/mod.ts'
import * as http from 'https://deno.land/std/http/mod.ts'
import * as log from 'https://deno.land/std/log/mod.ts'
import * as p2r from 'https://deno.land/x/path_to_regexp/index.ts'
import * as path from 'https://deno.land/std/path/mod.ts'
import * as io from 'https://deno.land/std/io/mod.ts'

const { EPG_URL, M3U_URL } = Deno.env.toObject()
let data = fetch(M3U_URL)
console.log('data ->', data)

// console.log('${Deno.mainModule}/.env ->', `${Deno.mainModule}/.env`)
// for (let line of Deno.readTextFileSync(`${Deno.mainModule}/.env`)) {
// 	console.log('line ->', line)
// }

// console.log('import.meta ->', import.meta)
// console.log('Deno.mainModule ->', Deno.mainModule)

// const server = http.serve({ hostname: '127.0.0.1', port: 8080 })
// for await (const request of server) {
// 	console.log('request ->', request)
// }

// setInterval(Function, 1 << 30)
