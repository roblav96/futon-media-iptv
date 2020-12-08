import * as assertion_error from 'https://deno.land/std/node/assertion_error.ts'
import * as asserts from 'https://deno.land/std/testing/asserts.ts'
import * as colors from 'https://deno.land/std/fmt/colors.ts'
import * as datetime from 'https://deno.land/std/datetime/mod.ts'
import * as log from 'https://deno.land/std/log/mod.ts'
import * as path from 'https://deno.land/std/path/mod.ts'
import * as printf from 'https://deno.land/std/fmt/printf.ts'
import * as util from 'https://deno.land/std/node/util.ts'
import { intercept } from 'https://deno.land/x/function_intercept/index.ts'

// @deno-types='https://cdn.skypack.dev/pretty-ms/dist=es2020,mode=types/index.d.ts'
import ms from 'https://cdn.skypack.dev/pretty-ms?dts'

const DEFAULT_INSPECT_OPTIONS = {
	colors: true,
	compact: false,
	depth: 4,
	getters: true,
	iterableLimit: Number.MAX_SAFE_INTEGER,
	showProxy: true,
	sorted: true,
	trailingComma: false,
} as Deno.InspectOptions

const BASE = path.toFileUrl(Deno.cwd()).toString()
function toCallSite(frame: string) {
	if (frame.includes('file:')) {
		if (frame.includes(`${BASE}/`)) {
			frame = frame.replace(`${BASE}/`, '')
		}
		frame = frame.replace(
			/<(.+)>:(\d+):(\d+)/,
			`${colors.cyan('$1')}:${colors.yellow('$2')}:${colors.yellow('$3')}`,
		)
	} else {
		frame = frame.replace(/(<.+>)/, `${colors.cyan('$1')}`)
	}
	return frame
}

console.log = new Proxy(console.log, {
	before: performance.now(),
	apply(method, ctx: Console, args: string[]) {
		let e = { stack: '' }
		Error.captureStackTrace(e, this.apply)
		let stack = e.stack.split('\n')[1].trim()
		let stacks = stack.split(' ')
		for (let i = 0; i < stacks.length; i++) {
			if (i == 0) {
				stacks[i] = stacks[i]
			} else if (i < stacks.length - 1) {
				stacks[i] = colors.italic(colors.bold(stacks[i]))
			} else if (i == stacks.length - 1) {
				stacks[i] = toCallSite(stacks[i])
			}
		}
		stack = stacks.join(' ')

		for (let i = 0; i < args.length; i++) {
			let arg = args[i]
			if (i == 0 && typeof arg == 'string') {
				continue
			}
			args[i] = Deno.inspect(arg, DEFAULT_INSPECT_OPTIONS)
		}

		let now = performance.now()
		let delta = now - this.before
		this.before = now
		let timestamp = ms(delta, { compact: true, formatSubMilliseconds: true })

		let header = `${colors.blue('■')} ${colors.dim(`${stack} +${timestamp}`)}`
		args[0] = `\n${header}\n${args[0]}`

		return Reflect.apply(method, ctx, args)
	},
} as ProxyHandler<typeof console.log> & { before: number })

declare global {
	namespace Deno {
		var core: any
		var internal: symbol
	}
	// interface Console {
	// 	new (): Console
	// 	readonly prototype: Console
	// }
}

//

// let regexp = /(\()?(<.+>)?(\))?(:)?(\d+)?(:)?(\d+)?(\))?/
// let parts = frame.split(regexp).filter(Boolean)
// Deno.core.print('\nparts -> ' + Deno.inspect(parts) + '\n')
// for (let i = 0; i < parts.length; i++) {
// 	let part = parts[i]
// 	if (part.startsWith('<') && part.endsWith('>')) {
// 		if (part.includes('file:')) {
// 			let file = part.slice(1, -1)
// 			// let base = path.dirname(path.dirname(Deno.mainModule))
// 			// let base = path.toFileUrl(Deno.cwd()).toString()
// 			part = path.relative(BASE, file)
// 		}
// 		parts[i] = colors.cyan(part)
// 	} else if (Number.isFinite(Number.parseInt(part))) {
// 		parts[i] = colors.yellow(part)
// 	}
// }
// return parts.join('')

// let parts = stack.split(/<(file:.+)>/)
// let filepath = parts[1]
// if (filepath?.startsWith('file:')) {
// 	let basepath = path.dirname(path.dirname(Deno.mainModule))
// 	parts[1] = colors.cyan(path.relative(basepath, filepath))
// }
// stack = parts.join('')
// Deno.core.print('\nstack -> ' + stack + '\n')

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
