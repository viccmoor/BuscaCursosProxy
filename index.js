export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const target = 'https://buscacursos.uc.cl' + url.pathname + url.search;

        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Max-Age': '86400',
                }
            });
        }

        const response = await fetch(target, {
            method: request.method,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': request.headers.get('Accept') || '*/*',
                'Referer': 'https://buscacursos.uc.cl',
                'Cookie': request.headers.get('Cookie') || '',
            },
            redirect: 'follow'
        });

        const newHeaders = new Headers(response.headers);
        newHeaders.set('Access-Control-Allow-Origin', '*');
        newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        newHeaders.set('Access-Control-Allow-Headers', '*');
        
        newHeaders.delete('Content-Security-Policy');
        newHeaders.delete('X-Frame-Options');

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
        });
    },
};