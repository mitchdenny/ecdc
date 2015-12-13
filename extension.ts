import * as core from './lib/core';
import * as crockford32 from './lib/crockford32';
import * as vscode from 'vscode';
import * as util from 'util';
import * as crypto from 'crypto';
var ent = require('ent');

class HtmlEntitiesToStringTransformer implements core.Transformer {
	public get label(): string {
		return 'HTML Entities to String';	
	}
	
	public get description(): string {
		return this.label;
	}
	
	public check(input: string): boolean {
		return true;
	}
	
	public transform(input: string): string {
		let output = ent.decode(input);
		return output;
	}
}

class StringToHtmlEntitiesTransformer implements core.Transformer {
	public get label(): string {
		return 'String to HTML Entities';	
	}
	
	public get description(): string {
		return this.label;
	}
	
	public check(input: string): boolean {
		return true;
	}
	
	public transform(input: string): string {
		let output = ent.encode(input, { named: true });
		return output;
	}
}

class StringToJsonArrayTransformer implements core.Transformer {
	public get label(): string {
		return 'String as JSON Byte Array';
	}
	
	public get description(): string {
		return this.label;	
	}
	
	public check(input: string): boolean {
		return true;
	}
	
	public transform(input: string): string {
		let buffer = new Buffer(input, 'utf8');
		let data = buffer.toJSON().data;
		let output = JSON.stringify(data);

		return output;
	}
}

class Base64ToJsonArrayTransformer implements core.Transformer {
	public get label(): string {
		return 'Base64 to JSON Byte Array';
	}
	
	public get description(): string {
		return this.label;
	}
	
	public check(input: string): boolean {
		return true;
	}
	
	public transform(input: string): string {
		let buffer = new Buffer(input, 'base64');
		let data = buffer.toJSON().data;
		let output = JSON.stringify(data);

		return output;
	}
}

class StringToMD5Transformer implements core.Transformer {
	public get label(): string {
		return 'String to MD5 Hase (Base64 Encoded)';
	}
	
	public get description(): string {
		return this.label;
	}
	
	public check(input: string): boolean {
		return true;
	}
	
	public transform(input: string): string {
		let hash = crypto.createHash('md5');
		hash.update(input, 'utf8');

		let output = hash.digest('base64');
		return output;
	}
}

class StringToBase64Transformer implements core.Transformer {
	public get label(): string {
		return 'String to Base64';
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

class Base64ToStringTransformer implements core.Transformer {
	public get label(): string {
		return "Base64 to String";
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
	private transformer: core.Transformer;
	private originalOffset: number;
	private updatedSelectionStartOffset: number;
	private inputOutputLengthDelta: number;

	public originalSelection: vscode.Selection;
	public updatedSelection: vscode.Selection;
	public updatedOffset: number;
	public input: string;
	public output: string;
	
	constructor(textEditor: vscode.TextEditor, originalSelection: vscode.Selection, transformer: core.Transformer, originalOffset: number) {
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

function processSelections(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, transformer: core.Transformer) {
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

function registerConvertSelectionCommand(context: vscode.ExtensionContext) {
	let convertSelectionDisposable = vscode.commands.registerTextEditorCommand('extension.convertSelection', (textEditor, edit) => {
		let transformers: core.Transformer[] = [
			new StringToBase64Transformer(),
			new Base64ToStringTransformer(),
			new StringToJsonArrayTransformer(),
			new Base64ToJsonArrayTransformer(),
			new StringToMD5Transformer(),
			new StringToHtmlEntitiesTransformer(),
			new HtmlEntitiesToStringTransformer(),
			new crockford32.IntegerToCrockfordBase32Transformer(),
			new crockford32.CrockfordBase32ToIntegerTransformer()
		];

		vscode.window.showQuickPick(transformers).then((transformer) => {
			processSelections(textEditor, edit, transformer);
		});
	});
		
	context.subscriptions.push(convertSelectionDisposable);
}

export function activate(context: vscode.ExtensionContext) {
	registerConvertSelectionCommand(context);
}