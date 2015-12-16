var ai = require('applicationinsights');
ai.setup('695ef12d-e9e9-46f3-8c76-1d94bbe763b2');
ai.start();

export function log(message: string) {
	ai.client.trackEvent(message);	
}