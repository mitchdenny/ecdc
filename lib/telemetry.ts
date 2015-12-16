import * as vscode from 'vscode';
var ai = require('applicationinsights');
ai.setup('695ef12d-e9e9-46f3-8c76-1d94bbe763b2');

export function log(message: string, properties: any) {
	let payload = {
		message: message,
		properties: properties
	};
	
	console.log(JSON.stringify(payload, null, '\t'));
	
	let configuration = vscode.workspace.getConfiguration('ecdc');
	let collectTelemetry = configuration.get('collectTelemetry');
	
	if (collectTelemetry) {
		ai.client.trackEvent(message, properties);	
	}
}