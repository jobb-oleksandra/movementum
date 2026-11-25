// Liten Worker foran de statiske filene:
// http:// og movementum.no (uten www) sendes videre til https://www.movementum.no.
// Alt annet serveres fra dist/ (med _redirects og _headers).
export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		// Alltid kryptert tilkobling: http:// -> https://
		if (url.protocol === 'http:') {
			url.protocol = 'https:';
			if (url.hostname === 'movementum.no') url.hostname = 'www.movementum.no';
			return Response.redirect(url.toString(), 301);
		}
		if (url.hostname === 'movementum.no') {
			url.hostname = 'www.movementum.no';
			url.protocol = 'https:';
			return Response.redirect(url.toString(), 301);
		}
		// Forsiden har én adresse: /index.html -> / (riktig canonical for Google).
		if (url.pathname === '/index.html') {
			url.pathname = '/';
			return Response.redirect(url.toString(), 301);
		}
		return env.ASSETS.fetch(request);
	},
};
