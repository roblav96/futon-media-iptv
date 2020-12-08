/** // @deno-types='https://raw.githubusercontent.com/sindresorhus/pretty-ms/master/index.d.ts'
import ms from 'https://cdn.skypack.dev/pretty-ms'

// import * as R from 'https://raw.githubusercontent.com/selfrefactor/rambdax/master/dist/rambdax.esm.js'
// import 'https://raw.githubusercontent.com/selfrefactor/rambdax/master/_ts-toolbelt/src/ts-toolbelt'
// deno-types='https://raw.githubusercontent.com/selfrefactor/rambdax/master/index.d.ts'
// deno-types='https://cdn.skypack.dev/rambdax/dist=es2020,mode=types/index.d.ts'

// @deno-types='../node_modules/rambdax/index.d.ts'
import * as R from '../node_modules/rambdax/index.d.ts'
R.add
Deno.core.print('\nR -> ' + Deno.inspect(R) + '\n') */

//

// console.time('console.log')
// for (let i = 0; i < 100000; i++) {
// 	console.log()
// }
// console.timeEnd('console.log')
// console.log('Object.getOwnPropertyNames ->', Object.getOwnPropertyNames(Deno[Deno.internal]))
// console.log('Reflect.ownKeys ->', Reflect.ownKeys(Deno[Deno.internal]))

// console.log = new Proxy(console.log, {
// 	get(target, property, receiver) {
// 		// Deno.core.print(`@get -> ${property.toString()}`)
// 		return Reflect.get(target, property, receiver)
// 	},
// 	apply(target, console: Console, args: any[]) {
// 		Deno.core.print(`\n<<< apply -> ${Deno.inspect(args, DEFAULT_INSPECT_OPTIONS)} >>>\n`)
// 		return Reflect.apply(target, console, args)
// 	},
// 	set(target, property, value, receiver) {
// 		// Deno.core.print(`@set -> ${property.toString()}`)
// 		return Reflect.set(target, property, value, receiver)
// 	},
// 	defineProperty(target, property, descriptor) {
// 		// Deno.core.print(`@defineProperty -> ${property.toString()}`)
// 		return Reflect.defineProperty(target, property, descriptor)
// 	},
// 	deleteProperty(target, property) {
// 		// Deno.core.print(`@deleteProperty -> ${property.toString()}`)
// 		return Reflect.deleteProperty(target, property)
// 	},
// })

// console.time('Proxy(console.log')
// for (let i = 0; i < 100000; i++) {
// 	console.log()
// }
// console.timeEnd('Proxy(console.log')

//

// console.log = intercept(console.log).before(function before(...args) {
// 	Deno.core.print('\n')
// 	Deno.core.print(Error.captureStackTrace(new Error(), before))
// 	Deno.core.print('\n')
// 	// args[0] = `\n${args[0]}`
// 	return args
// })

//

// interface DenoConsole extends Console {} // @ts-ignore
// class DenoConsole extends Deno[Deno.internal].Console {
// 	constructor() {
// 		super(Deno.core.print)
// 	}
// 	log(...args: any[]) {
// 		Deno.core.print(this.toString())
// 		super.log(...args)
// 	}
// }
// console = new DenoConsole()
