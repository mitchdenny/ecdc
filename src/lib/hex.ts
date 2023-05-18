import * as core from './core';

export class StringToHexTransformer implements core.Transformer {
	public get label(): string {
		return 'String to Hex';
	}

	public get description(): string {
		return this.label;
	}

	public check(input: string): boolean {
		return true;
	}

	public transform(input: string): string {
		let output = "";
		for (let i = 0; i < input.length; i++) {
			const charCode = input.charCodeAt(i);
			const hex = charCode.toString(16);
			output += hex.padStart(2, "0");
		}
		return output;
	}
}

export class HexToStringTransformer implements core.Transformer {
	public get label(): string {
		return "Hex to String";
	}

	public get description(): string {
		return this.label;
	}

	public check(input: string): boolean {
		return true;
	}

	public transform(input: string): string {
		let output = '';
		for (let i = 0; i < input.length; i += 2) {
			const hex = input.substring(i, i + 2);
			const charCode = parseInt(hex, 16);
			output += String.fromCharCode(charCode);
		}
		return output;
	}
}

