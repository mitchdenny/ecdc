import * as vscode from 'vscode';
import * as util from 'util';
import * as crypto from 'crypto';

interface Transformer extends vscode.QuickPickItem {
	
	check(input: string): boolean;
	transform(input: string): string;
	
}

class StringToBase64Transformer implements Transformer {
	
	public get label(): string {
		return 'Encode String to Base64';
	}
	
	public get description(): string {
		return this.label;
	}
	
	public check(input: string): boolean {
		return true;
	}
	
	public transform(input: string): string {
		var buffer = new Buffer(input);
		var output = buffer.toString('base64');
		return output;		
	}
	
}

class Base64ToStringTransformer implements Transformer {
	
	public get label(): string {
		return "Decode Base64 to String";
	}
	
	public get description(): string {
		return this.label;
	}
	
	public check(input: string): boolean {
		return true;
	}
	
	public transform(input: string): string {
		var buffer = new Buffer(input, 'base64');
		var output = buffer.toString('utf8');
		return output;
	}
	
}

class Context {

	public failedChanges: Change[] = [];
	
}

class Change {
	
	private textEditor: vscode.TextEditor;
	private transformer: Transformer;
	private originalOffset: number;
	private updatedSelectionStartOffset: number;
	private inputOutputLengthDelta: number;

	public originalSelection: vscode.Selection;
	public updatedSelection: vscode.Selection;
	public updatedOffset: number;
	public input: string;
	public output: string;
	
	constructor(textEditor: vscode.TextEditor, originalSelection: vscode.Selection, transformer: Transformer, originalOffset: number) {
		
		this.textEditor = textEditor;
		this.originalSelection = originalSelection;
		this.transformer = transformer;
		this.originalOffset = originalOffset;
	
	}
	
	public transformText(context: Context, edit: vscode.TextEditorEdit) {
		
		let originalSelectionStartOffset = this.textEditor.document.offsetAt(this.originalSelection.start);
		let originalSelectionEndOffset = this.textEditor.document.offsetAt(this.originalSelection.end);
		let originalSelectionLength = originalSelectionEndOffset - originalSelectionStartOffset;
		
		this.updatedSelectionStartOffset = originalSelectionStartOffset + this.originalOffset;
		
		let range = new vscode.Range(this.originalSelection.start, this.originalSelection.end);
		this.input = this.textEditor.document.getText(range);
		
		if (this.transformer.check(this.input) == true) {
			
			this.output = this.transformer.transform(this.input);
			
		} else {
			
			this.output = this.input;
			context.failedChanges.push(this);
			
		}
		
		edit.replace(range, this.output);

		this.inputOutputLengthDelta = this.output.length - this.input.length;
		this.updatedOffset = this.originalOffset + this.inputOutputLengthDelta;
	}
	
	public updateSelection() {
		
		let updatedSelectionStart = this.textEditor.document.positionAt(this.updatedSelectionStartOffset);
		let updatedSelectionEnd = this.textEditor.document.positionAt(this.updatedSelectionStartOffset + this.output.length);

		// Build and store the new selection.
		this.updatedSelection = new vscode.Selection(updatedSelectionStart, updatedSelectionEnd);		
	}
}

function processSelections(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, transformer: Transformer) {
	
	let document = textEditor.document;
	let changes: Change[] = [];
	let updatedSelections: vscode.Selection[] = [];
	let context = new Context();
	
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
				transformer,
				offset
				);
			
			changes[selectionIndex] = change;
			
			change.transformText(context, editBuilder);
			
		}
		
	}).then(() => {
		
		for (let changeIndex = 0; changeIndex < changes.length; changeIndex++) {
		
			let change = changes[changeIndex];
			change.updateSelection();
			updatedSelections.push(change.updatedSelection);
			
		}
		
		textEditor.selections = updatedSelections;
		
	}).then(() => {
		
		if (context.failedChanges.length != 0) {
			
			let message = util.format(
				'%s selections could not be processed.',
				context.failedChanges.length
				);
			
			vscode.window.showWarningMessage(message);		
		}
		
	});
		
}

function registerEncodeSelectionCommand(context: vscode.ExtensionContext) {
	
	let encodeSelectionDisposable = vscode.commands.registerTextEditorCommand('extension.encodeSelection', (textEditor, edit) => {

		let encodeTransformers: Transformer[] = [
			new StringToBase64Transformer(),
		];
		
		vscode.window.showQuickPick(encodeTransformers).then((transformer) => {

			processSelections(textEditor, edit, transformer);
			
		});

	});
	
	context.subscriptions.push(encodeSelectionDisposable);

}

function registerDecodeSelectionCommand(context: vscode.ExtensionContext) {
	
	let decodeSelectionDisposable = vscode.commands.registerTextEditorCommand('extension.decodeSelection', (textEditor, edit) => {
	
		let decodeTransformers: Transformer[] = [
			new Base64ToStringTransformer()	
		];

		vscode.window.showQuickPick(decodeTransformers).then((transformer) => {

			processSelections(textEditor, edit, transformer);
	
		});

	});
		
	context.subscriptions.push(decodeSelectionDisposable);

}

export function activate(context: vscode.ExtensionContext) {
	
	registerEncodeSelectionCommand(context);
	registerDecodeSelectionCommand(context);
	
}