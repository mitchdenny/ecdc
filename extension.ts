import * as vscode from 'vscode';
var sortby = require('sort-by');

function processSelections(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, transform: (string) => string) {
	
		for (let selectionIndex in textEditor.selections) {
			let selection = textEditor.selections[selectionIndex];
		}
	
}

function registerEncodeSelectionCommand(context: vscode.ExtensionContext) {
	
	var encodeSelectionDisposable = vscode.commands.registerTextEditorCommand('extension.encodeSelection', (textEditor, edit) => {
	
		processSelections(textEditor, edit, (input) => {
				var buffer = new Buffer(input);
				var output = buffer.toString('base64');
				return output;
		});

	});
	
	context.subscriptions.push(encodeSelectionDisposable);

}

function registerDecodeSelectionCommand(context: vscode.ExtensionContext) {
	
	var decodeSelectionDisposable = vscode.commands.registerTextEditorCommand('extension.decodeSelection', (textEditor, edit) => {
	
		processSelections(textEditor, edit, (input) => {
				var buffer = new Buffer(input, 'base64');
				var output = buffer.toString('utf8');
				return output;
		});

	});
		
	context.subscriptions.push(decodeSelectionDisposable);

}

export function activate(context: vscode.ExtensionContext) {

	registerEncodeSelectionCommand(context);
	registerDecodeSelectionCommand(context);
	
}