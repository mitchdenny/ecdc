import * as vscode from 'vscode';
var sortby = require('sort-by');

function processSelections(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, transform: (input: string) => string) {
	let changes = [];
	textEditor.edit((editBuilder) => {
		
		for (let selectionIndex = 0; selectionIndex < textEditor.selections.length; selectionIndex++) {

			let selection = textEditor.selections[selectionIndex];
			
			let range = new vscode.Range(
				selection.start.line,
				selection.start.character,
				selection.end.line,
				selection.end.character	
			);
			
			let input = textEditor.document.getText(range);
			let output = transform(input);
			
			changes.push({
				"originalStartLine": selection.start.line,
				"originalStartCharacter": selection.start.character,
				"originalEndLine": selection.end.line,
				"originalEndCharacter": selection.end.character,
				"originalText": input,
				"updatedText": output,
				"characterDelta": output.length - input.length
			});

			editBuilder.replace(range, output);
			
		}
	}).then(() => {

		let lineOffset = 0;
		let characterOffset = 0;

		changes.sort(sortby('originalStartLine', 'originalStartCharacter'));
		let updatedSelections: vscode.Selection[] = [];
		
		for (let changeIndex = 0; changeIndex < changes.length; changeIndex++) {
			
			let change = changes[changeIndex];
			
			var updatedSelection = new vscode.Selection(
				change.originalStartLine + lineOffset,
				change.originalStartCharacter + characterOffset,
				change.originalEndLine + lineOffset,
				change.originalEndCharacter + change.characterDelta	+ characterOffset
			);
			
			lineOffset = lineOffset + change.lineDelta;
			characterOffset = characterOffset + change.characterDelta;
			
			updatedSelections.push(updatedSelection);

		}
		
		textEditor.selections = updatedSelections;
		
	});
}

export function activate(context: vscode.ExtensionContext) {

	var selectionProblemDisposable = vscode.commands.registerTextEditorCommand('extension.selectionProblem', (textEditor, edit) => {
		
		processSelections(textEditor, edit, (input) => {
			var buffer = new Buffer(input);
			var output = buffer.toString('base64');
			console.log('Converted %s to %s.', input, output);
			return output;
		});

	});
	
	context.subscriptions.push(selectionProblemDisposable);

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