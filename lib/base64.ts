import * as core from './core';

export class StringToBase64Transformer implements core.Transformer {
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

export class Base64ToStringTransformer implements core.Transformer {
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

