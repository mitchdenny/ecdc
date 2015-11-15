import * as vscode from 'vscode';
class Change {
	private textEditor: vscode.TextEditor;
	private transform: (string) => string;
	private originalOffset: number;
	private updatedSelectionStartOffset: number;
	private inputOutputLengthDelta: number;

	public originalSelection: vscode.Selection;
	public updatedSelection: vscode.Selection;
	public updatedOffset: number;
	public input: string;
	public output: string;
	
	constructor(textEditor: vscode.TextEditor, originalSelection: vscode.Selection, transform: (string) => string, originalOffset: number) {
		this.textEditor = textEditor;
		this.originalSelection = originalSelection;
		this.transform = transform;
		this.originalOffset = originalOffset;
	}
	
	transformText(edit: vscode.TextEditorEdit) {
		
		let originalSelectionStartOffset = this.textEditor.document.offsetAt(this.originalSelection.start);
		let originalSelectionEndOffset = this.textEditor.document.offsetAt(this.originalSelection.end);
		let originalSelectionLength = originalSelectionEndOffset - originalSelectionStartOffset;
		
		this.updatedSelectionStartOffset = originalSelectionStartOffset + this.originalOffset;
		
		let range = new vscode.Range(this.originalSelection.start, this.originalSelection.end);
		this.input = this.textEditor.document.getText(range);
		this.output = this.transform(this.input);
		edit.replace(range, this.output);

		this.inputOutputLengthDelta = this.output.length - this.input.length;
		this.updatedOffset = this.originalOffset + this.inputOutputLengthDelta;
	}
	
	updateSelection() {
		
		let updatedSelectionStart = this.textEditor.document.positionAt(this.updatedSelectionStartOffset);
		let updatedSelectionEnd = this.textEditor.document.positionAt(this.updatedSelectionStartOffset + this.output.length);

		// Build and store the new selection.
		this.updatedSelection = new vscode.Selection(updatedSelectionStart, updatedSelectionEnd);		
	}
}

function processSelections(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, transform: (string) => string) {
	
	let document = textEditor.document;
	let changes: Change[] = [];
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
			
			change.transformText(editBuilder);
			
		}
		
	}).then(() => {
		
		for (let changeIndex = 0; changeIndex < changes.length; changeIndex++) {
			let change = changes[changeIndex];
			change.updateSelection();
			updatedSelections.push(change.updatedSelection);
			
		}
		
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