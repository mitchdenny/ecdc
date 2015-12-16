var ai = null;

export function log(message: string, properties: any) {
	if (ai != null) {
		ai.client.trackEvent(message, properties);	
	}
}

export function enable() {
	ai = require('applicationinsights');
	ai.setup('695ef12d-e9e9-46f3-8c76-1d94bbe763b2');
	ai.start();
}