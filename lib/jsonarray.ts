import * as core from './core';

export class StringToJsonArrayTransformer implements core.Transformer {
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

export class Base64ToJsonArrayTransformer implements core.Transformer {
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
