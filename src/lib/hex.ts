import * as core from './core';

export class JsonByteArrayToHexStringTransformer implements core.Transformer {
	public get label(): string {
		return 'JSON Byte Array to Hex String';
	}

	public get description(): string {
		return this.label;
	}

	public check(input: string): boolean {
		const parsedInput = JSON.parse(input);
		if (!Array.isArray(parsedInput)) return false;

		for (let i = 0; i < parsedInput.length; i++) {
			const element = parsedInput[i];
			if (!Number.isInteger(element)) return false;
			if (element < 0 || element > 255) return false;
		}

		return true;
	}

	public transform(input: string): string {
		const parsedInput = JSON.parse(input);
		let output = '';

		for (let i = 0; i < parsedInput.length; i++) {
			const element = parsedInput[i];
			const hexElement = element.toString(16).padStart(2, '0');
			output += hexElement;
		}

		return output;
	}
}
