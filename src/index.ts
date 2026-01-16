import { corsHeaders, withCors } from './utils';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const targetUrl = 'https://buscacursos.uc.cl' + url.pathname + url.search;

		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: corsHeaders(),
			});
		}

		const cache = caches.default;
		const cacheKey = new Request(targetUrl, request);

		let response = await cache.match(cacheKey);
		if (response) {
			return withCors(response);
		}

		response = await fetch(targetUrl, {
			method: 'GET',
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
				'Accept': request.headers.get('Accept') || '*/*',
				'Referer': 'https://buscacursos.uc.cl',
			},
			cf: {
				cacheTtl: 300,
				cacheEverything: true,
			},
		});

		response = withCors(response);
		ctx.waitUntil(cache.put(cacheKey, response.clone()));

		return response;
	},
} satisfies ExportedHandler<Env>;
