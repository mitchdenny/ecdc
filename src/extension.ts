import * as util from 'util';
import * as vscode from 'vscode';
import * as base64 from './lib/base64';
import * as core from './lib/core';
import * as crockford32 from './lib/crockford32';
import * as htmlentities from './lib/htmlentities';
import * as json from './lib/json';
import * as hash from './lib/hash';
import * as unicode from './lib/unicode';
import * as urlEncode from './lib/urlencode';
import * as xmlentities from './lib/xmlentities';
import * as yaml from './lib/yaml';
import * as hex from './lib/hex';

class Context {
	public failedChanges: Change[] = [];
}

class Change {
	private textEditor: vscode.TextEditor;
	private transformer: core.Transformer;
	private originalOffset: number;
	private updatedSelectionStartOffset = -1;
	private inputOutputLengthDelta = -1;

	public originalSelection: vscode.Selection;
	public updatedSelection: vscode.Selection;
	public updatedOffset = -1;
	public input = "";
	public output = "";

	constructor(textEditor: vscode.TextEditor, originalSelection: vscode.Selection, transformer: core.Transformer, originalOffset: number) {
		this.textEditor = textEditor;
		this.originalSelection = originalSelection;
		this.updatedSelection = this.originalSelection;
		this.transformer = transformer;
		this.originalOffset = originalOffset;
	}

	public transformText(context: Context, edit: vscode.TextEditorEdit) {
		const originalSelectionStartOffset = this.textEditor.document.offsetAt(this.originalSelection.start);
		//let originalSelectionEndOffset = this.textEditor.document.offsetAt(this.originalSelection.end);
		//let originalSelectionLength = originalSelectionEndOffset - originalSelectionStartOffset;

		this.updatedSelectionStartOffset = originalSelectionStartOffset + this.originalOffset;

		const range = new vscode.Range(this.originalSelection.start, this.originalSelection.end);
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
		if (this.updatedSelectionStartOffset != undefined && this.output != undefined) {
			const updatedSelectionStart = this.textEditor.document.positionAt(this.updatedSelectionStartOffset);
			const updatedSelectionEnd = this.textEditor.document.positionAt(this.updatedSelectionStartOffset + this.output.length);

			// Build and store the new selection.
			this.updatedSelection = new vscode.Selection(updatedSelectionStart, updatedSelectionEnd);
		}
	}
}

function processSelections(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, transformer: core.Transformer) {
	// let document = textEditor.document;
	const changes: Change[] = [];
	const updatedSelections: vscode.Selection[] = [];
	const context = new Context();

	textEditor.edit((editBuilder) => {
		for (let selectionIndex = 0; selectionIndex < textEditor.selections.length; selectionIndex++) {
			const selection = textEditor.selections[selectionIndex];

			let offset = 0;
			if (selectionIndex != 0) {
				const previousChange = changes[selectionIndex - 1];
				offset = previousChange.updatedOffset;
			}

			const change = new Change(
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

			const change = changes[changeIndex];
			change.updateSelection();
			updatedSelections.push(change.updatedSelection);
		}

		textEditor.selections = updatedSelections;
	}).then(() => {
		if (context.failedChanges.length != 0) {
			const message = util.format(
				'%s selections could not be processed.',
				context.failedChanges.length
			);

			vscode.window.showWarningMessage(message);
		}
	});
}

function selectAndApplyTransformation(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
	const transformers: core.Transformer[] = [
		new base64.StringToBase64Transformer(),
		new base64.Base64ToStringTransformer(),
		new hash.StringToMD5Base64Transformer(),
		new hash.StringToMD5HexTransformer(),
		new hash.StringToSHA1Base64Transformer(),
		new hash.StringToSHA1HexTransformer(),
		new hash.StringToSHA256Base64Transformer(),
		new hash.StringToSHA256HexTransformer(),
		new hash.StringToSHA512Base64Transformer(),
		new hash.StringToSHA512HexTransformer(),
		new htmlentities.StringToHtmlEntitiesTransformer(),
		new htmlentities.StringToHtmlDecimalEntitiesTransformer(),
		new htmlentities.HtmlEntitiesToStringTransformer(),
		new xmlentities.StringToXmlEntitiesTransformer(),
		new xmlentities.XmlEntitiesToStringTransformer(),
		new crockford32.IntegerToCrockfordBase32Transformer(),
		new crockford32.CrockfordBase32ToIntegerTransformer(),
		new unicode.StringToUnicodeTransformer(),
		new unicode.UnicodeToStringTransformer(),
		new urlEncode.StringToEncodedUrlTransformer(),
		new urlEncode.EncodedUrlToStringTransformer(),
		new yaml.JsonToYamlTransformer(),
		new yaml.YamlToJsonTransformer(),
		new json.StringToJsonArrayTransformer(),
		new json.StringToJsonStringTransformer(),
		new json.JsonStringToStringTransformer(),
		new json.Base64ToJsonArrayTransformer(),
		new hex.JsonByteArrayToHexStringTransformer()
	];

	vscode.window.showQuickPick(transformers).then((transformer) => {
		if (transformer != undefined) {
			processSelections(textEditor, edit, transformer);
		}
	});
}

function registerConvertSelectionCommands(context: vscode.ExtensionContext) {
	const subtleConvertSelectionDisposable = vscode.commands.registerTextEditorCommand('extension.subtleConvertSelection', (textEditor, edit) => {
		selectAndApplyTransformation(textEditor, edit);
	});

	const convertSelectionDisposable = vscode.commands.registerTextEditorCommand('extension.convertSelection', (textEditor, edit) => {
		selectAndApplyTransformation(textEditor, edit);
	});

	context.subscriptions.push(subtleConvertSelectionDisposable);
	context.subscriptions.push(convertSelectionDisposable);
}

export function activate(context: vscode.ExtensionContext) {
	registerConvertSelectionCommands(context);
}