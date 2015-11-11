import * as vscode from 'vscode'; 

function processSelections(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, transform: (input: string) => string) {
	
	let updatedSelections: vscode.Selection[] = [];
	let characterOffset = 0;
	let lineOffset = 0;
	
	for (let selectionIndex = 0; selectionIndex < textEditor.selections.length; selectionIndex++) {
		
		let selection = textEditor.selections[selectionIndex];
		let range = new vscode.Range(selection.start, selection.end);
		let input = textEditor.document.getText(range);
		let output = transform(input);
		
		characterOffset = output.length - input.length;
		
		edit.replace(selection, output);
		
		console.log('selection.start.line = %s', selection.start.line);
		console.log('selection.start.character = %s', selection.start.character);
		console.log('selection.end.line = %s', selection.end.line);
		console.log('selection.end.character = %s', selection.end.character);
		console.log('characterOffset = %s', characterOffset);
		console.log('input.length = %s', input.length);
		console.log('output.length = %s', output.length);
		console.log('selection.start.character + output.length', selection.start.character + output.length);
		
		// BUG?? This code will select five characters.
		let updatedSelection = new vscode.Selection(
			selection.start.line,
			selection.start.character,
			selection.start.line,
			8
		);

		// BUG?? This code will select three characters.
		let updatedSelection = new vscode.Selection(
			selection.start.line,
			selection.start.character,
			selection.start.line,
			7
		);
		
		// PROBLEM?? How do you select 4 characters.
		// ADDITIONAL INFO: Only appears to happen when
		// you are replacing a selection that overlaps
		// the original selection.
				
		textEditor.selection = updatedSelection;	
	}
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