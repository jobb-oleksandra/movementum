// Liten Worker foran de statiske filene:
// movementum.no (uten www) sendes videre til https://www.movementum.no.
// Alt annet serveres fra dist/ (med _redirects og _headers).
export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		if (url.hostname === 'movementum.no') {
			url.hostname = 'www.movementum.no';
			url.protocol = 'https:';
			return Response.redirect(url.toString(), 301);
		}
		return env.ASSETS.fetch(request);
	},
};
