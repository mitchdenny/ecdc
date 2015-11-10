import * as vscode from 'vscode'; 

export function activate(context: vscode.ExtensionContext) {

	var encodeSelectionDisposable = vscode.commands.registerTextEditorCommand('extension.encodeSelection', (textEditor, edit) => {
		textEditor.edit((editBuilder) => {
			var range = new vscode.Range(textEditor.selection.start, textEditor.selection.end);
			var text = textEditor.document.getText(range);
			
			var buffer = new Buffer(text);
			var encodedText = buffer.toString('base64');
			
			editBuilder.replace(textEditor.selection, encodedText);
		});
	});
	
	context.subscriptions.push(encodeSelectionDisposable);
	
	var decodeSelectionDisposable = vscode.commands.registerTextEditorCommand('extension.decodeSelection', (textEditor, edit) => {
		textEditor.edit((editBuilder) => {
			var range = new vscode.Range(textEditor.selection.start, textEditor.selection.end);
			var text = textEditor.document.getText(range);
			
			var buffer = new Buffer(text, 'base64');
			var decodedText = buffer.toString('utf8');
			
			editBuilder.replace(textEditor.selection, decodedText);
		});
	});
		
	context.subscriptions.push(decodeSelectionDisposable);
}