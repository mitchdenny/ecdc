import * as vscode from 'vscode';
var sortby = require('sort-by');

class Change {
	private textEditor: vscode.TextEditor;
	private transform: (string) => string;
	private originalOffset: number;

	public originalSelection: vscode.Selection;
	public updatedSelection: vscode.Selection;
	public updatedOffset: number;
	
	constructor(textEditor: vscode.TextEditor, originalSelection: vscode.Selection, transform: (string) => string, originalOffset: number) {
		this.textEditor = textEditor;
		this.originalSelection = originalSelection;
		this.transform = transform;
		this.originalOffset = originalOffset;
	}
	
	apply(edit: vscode.TextEditorEdit) {
		
		// Grab the text from the document and replace it.
		let range = new vscode.Range(this.originalSelection.start, this.originalSelection.end);
		let input = this.textEditor.document.getText(range);
		let output = this.transform(input);
		edit.replace(range, output);

		// Determine the delta in the input <-> output and recompute the updated selection end position.
		let inputOutputLengthDelta = output.length - input.length;

		// Calculates the offsets for the original selection;
		let originalSelectionStartOffset = this.textEditor.document.offsetAt(this.originalSelection.start);
		let originalSelectionEndOffset = this.textEditor.document.offsetAt(this.originalSelection.end);
		let originalSelectionLength = originalSelectionEndOffset - originalSelectionStartOffset;
		
		// Shifts the selection offsets to incorporate previous selections that have been adjusted already.
		let updatedSelectionStartOffset = originalSelectionStartOffset + this.originalOffset;
		let updatedSelectionEndOffset = updatedSelectionStartOffset + originalSelectionLength + inputOutputLengthDelta;
		
		let updatedSelectionStart = this.textEditor.document.positionAt(updatedSelectionStartOffset);
		let updatedSelectionEnd = this.textEditor.document.positionAt(updatedSelectionEndOffset);

		// Build and store the new selection.
		this.updatedSelection = new vscode.Selection(updatedSelectionStart, updatedSelectionEnd);
		this.updatedOffset = this.originalOffset + inputOutputLengthDelta;
	}
}

function processSelections(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, transform: (string) => string) {
	
	let document = textEditor.document;
	let changes = [];
	let updatedSelections: vscode.Selection[] = [];
	
	textEditor.edit((editBuilder) => {
		
		for (let selectionIndex = 0; selectionIndex < textEditor.selections.length; selectionIndex++) {
			
			let selection = textEditor.selections[selectionIndex];
	
			let offset = 0;
			if (selectionIndex != 0) {
				let previousChange = changes[selectionIndex - 1];
				offset = previousChange.updatedOffset;
			}
			
			let change = new Change(
				textEditor,
				selection,
				transform,
				offset
				);
			
			changes[selectionIndex] = change;
			
			change.apply(editBuilder);
			updatedSelections.push(change.updatedSelection);
			
		}
		
	}).then(() => {
		textEditor.selections = updatedSelections;
	});
	

		
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