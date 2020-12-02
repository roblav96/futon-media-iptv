export async function get() {
	let response = await fetch(Deno.env.get('M3U_URL') as string)
	console.log('response ->', response)
	if (response.body) {
		let text = await response.text()
		console.log('text ->', text)
		// let reader = response.json
		// let iter = io.BufReader.create(reader).readLine
		// // let delim = /(?:\r?\n)/g
		// for await (let Array of io.BufReader.create(response.body.getReader()).readFull()) {

		// }
		// // console.log('response ->', response.body.getReader())
	}
}
