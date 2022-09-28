import * as fs from 'https://deno.land/std/fs/mod.ts'
import * as path from 'https://deno.land/std/path/mod.ts'
import cache_dir from 'https://deno.land/x/dir/cache_dir/mod.ts'

export class Db<T extends string> {
	dirpath: string
	keypath(key: string) {
		if (key.startsWith('file:')) {
			let relative = path.relative(path.toFileUrl(Deno.cwd()).href, key)
			if (relative && !relative.startsWith('file:') && !path.isAbsolute(relative)) {
				key = relative
			}
		}
		return path.join(this.dirpath, key.replaceAll(/\W/g, '_'))
	}

	constructor(public namespace = '', public ttl?: number) {
		if (this.namespace.startsWith('file:')) {
			this.namespace = path.basename(this.namespace)
		}
		this.dirpath = path.join(
			cache_dir()!,
			'futon-media-iptv',
			this.namespace.replaceAll(/\W/g, '_'),
		)
	}

	async clear() {
		await Deno.remove(this.dirpath, { recursive: true }).catch(() => {})
	}

	async delete(key: string) {
		await Deno.remove(this.keypath(key)).catch(() => {})
	}

	async has(key: string) {
		return await fs.exists(this.keypath(key))
	}

	async get<TT = T>(key: string) {
		let data = await Deno.readTextFile(this.keypath(key)).catch(() => {})
		if (!data) return
		let [value, ttl] = JSON.parse(data) as [TT, number?]
		if (Number.isFinite(ttl) && Date.now() > ttl!) {
			await this.delete(key)
		} else {
			return value
		}
	}

	async set<TT = T>(key: string, value: TT, ttl?: number) {
		if (!Number.isFinite(ttl) && Number.isFinite(this.ttl)) {
			ttl = this.ttl
		}
		await fs.ensureDir(this.dirpath)
		await Deno.writeTextFile(
			this.keypath(key),
			JSON.stringify(Number.isFinite(ttl) ? [value, Date.now() + ttl!] : [value]),
		)
	}

	async entries<TT = T>() {
		let entries = [] as [string, TT][]
		try {
			for await (let entry of Deno.readDir(this.dirpath)) {
				let value = await this.get<TT>(entry.name)
				if (value) entries.push([entry.name, value])
			}
		} catch {}
		return entries
	}
	async keys() {
		return (await this.entries()).map(([key, value]) => key)
	}
	async values<TT = T>() {
		return (await this.entries<TT>()).map(([key, value]) => value) as TT[]
	}
}

export const db = new Db('')
export default db
