import * as vscode from 'vscode'; 

export function activate(context: vscode.ExtensionContext) {

	var encodeSelectionDisposable = vscode.commands.registerTextEditorCommand('extension.encodeSelection', (textEditor, edit) => {
		textEditor.edit((editBuilder) => {
			editBuilder.replace(textEditor.selection, 'Encode');
		}).then(() => {
			vscode.window.showInformationMessage('Encoded!');
		});
	});
	
	context.subscriptions.push(encodeSelectionDisposable);
	
	var decodeSelectionDisposable = vscode.commands.registerTextEditorCommand('extension.decodeSelection', (textEditor, edit) => {
		textEditor.edit((editBuilder) => {
			editBuilder.replace(textEditor.selection, 'Decode');
		}).then(() => {
			vscode.window.showInformationMessage('Decoded!');
		});
	});
		
	context.subscriptions.push(decodeSelectionDisposable);
}