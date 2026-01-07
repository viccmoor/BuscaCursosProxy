export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const target = 'https://buscacursos.uc.cl' + url.pathname + url.search;

		const response = await fetch(target, {
			method: request.method,
			headers: {
				'User-Agent': request.headers.get('User-Agent') || '',
				'Accept': request.headers.get('Accept') || '*/*',
				'Referer': 'https://buscacursos.uc.cl',
			},
			redirect: 'follow'
		});

		const newHeaders = new Headers(response.headers);
		newHeaders.set('Access-Control-Allow-Origin', '*');
		newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
		newHeaders.set('Access-Control-Allow-Headers', '*');

		return new Response(await response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: newHeaders,
		});
	},
};
