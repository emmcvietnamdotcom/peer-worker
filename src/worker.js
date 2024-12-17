/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const corsHeaders = {
	'Access-Control-Allow-Headers': '*', // What headers are allowed. * is wildcard. Instead of using '*', you can specify a list of specific headers that are allowed, such as: Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Authorization.
	'Access-Control-Allow-Methods': 'GET', // Allowed methods. Others could be GET, PUT, DELETE etc.
	'Access-Control-Allow-Origin': '*', // This is URLs that are allowed to access the server. * is the wildcard character meaning any URL can.
};

export default {
	async fetch(request, env, ctx) {
		// Use a default IP address for development if cf-connecting-ip is not available
		const client_IP = request.headers.get('cf-connecting-ip') || '127.0.0.1';
		const url = 'https://cloudflare-dns.com/dns-query?name=emmcvietnam.com';
		const response = await fetch(url, {
			headers: {
				Accept: 'application/dns-json',
			},
		});

		if (!response.ok) {
			return new Response('Failed to fetch DNS data', { status: 500 });
		}

		const jsonData = await response.json();

		return new Response(
			JSON.stringify(jsonData['Answer'].find((item) => item.type === 1 && item.data === client_IP) || { response: null }),
			{
				headers: {
					'Content-type': 'application/json',
					...corsHeaders, //uses the spread operator to include the CORS headers.
				},
			}
		);
	},
};
