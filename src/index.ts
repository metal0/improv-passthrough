import { ImprovEmailWebhook, censorPayload } from './improvmx.js';
import { platforms } from './platform.js';
import './bridges/discord/process'
import './bridges/matrix-hookshot/process'

export interface Env {
	// improv: KVNamespace;
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	SECRET: string;
	MATRIX_HOOKSHOT_HOST: string;
}



async function routeRequest(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	const queryParams = new URLSearchParams(request.url.split('/').slice(3).join('/'));
	const platform = queryParams.get('platform')?.split('/').join('');
	const platformToken = queryParams.get('platform_token');
	if(!platform || !platformToken) return new Response(JSON.stringify({success: false, status: 400, message: "Invalid platform or platform_token"}));
	if(!platforms[platform]) return new Response(JSON.stringify({success: false, message: `Invalid platform "${platform}", available = ${JSON.stringify(Object.keys(platforms), null, 2)}`}), {status: 400, statusText: "Bad Request"});

	try {
		const webhook = await request.json();
		// console.log('webhook', webhook);
		// await env.improv.put('latest-webhook', JSON.stringify(webhook, null, 2));
		const validate = ImprovEmailWebhook.parse(webhook);
		// return new Response(JSON.stringify(validate, null, 2));

		const res = await platforms[platform].handler({request, env, ctx, token: platformToken, webhook: censorPayload( validate)});
		if(res === true) return new Response(JSON.stringify({success: true}), {status: 200})
		return new Response(JSON.stringify({success: false, message: res}), {status: 400});
	} catch(e: any) {
		console.error(e);
		// await env.improv.put('latest-error', JSON.stringify(e, null, 2));
		return new Response(JSON.stringify({success: false, message: e.message}), {status: 500});
	}
}

function allowRequest(request: Request, env: Env) {
	const queryParams = new URLSearchParams(request.url.split('/').slice(3).join('/'));
	const accessToken = queryParams.get('access_token');
	// @ts-ignore
	return accessToken === env.SECRET;
}


export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		if(!allowRequest(request, env)) return new Response(JSON.stringify({success: false, message: `Invalid service access token`}), {status: 403, statusText: "Forbidden"});
		return await routeRequest(request, env, ctx);
	},
};
