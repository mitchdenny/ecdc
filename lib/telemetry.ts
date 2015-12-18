import * as vscode from 'vscode';
var ai = require('applicationinsights');
ai.setup('695ef12d-e9e9-46f3-8c76-1d94bbe763b2');

export function trackEvent(code: string, properties?: { [key: string]: string; }, measurements?: { [key: string]: number; }) {
	let payload = {
		code: code,
		properties: properties,
		measurements: measurements
	};
	
	console.log(JSON.stringify(payload, null, '\t'));
	
	let configuration = vscode.workspace.getConfiguration('ecdc');
	let collectTelemetry = configuration.get('collectTelemetry');
	
	if (collectTelemetry) {
		ai.client.trackEvent(code, properties);	
	}
}