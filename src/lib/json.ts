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
		const buffer = Buffer.from(input, 'utf8');
		const data = buffer.toJSON().data;
		const output = JSON.stringify(data);

		return output;
	}
}

export class StringToJsonStringTransformer implements core.Transformer {
	public get label(): string {
		return 'String as JSON String';
	}

	public get description(): string {
		return this.label;
	}

	public check(input: string): boolean {
		return true;
	}

	public transform(input: string): string {
		const output = JSON.stringify(input);
		return output;
	}
}

export class JsonStringToStringTransformer implements core.Transformer {
	public get label(): string {
		return 'JSON String as String';
	}

	public get description(): string {
		return this.label;
	}

	public check(input: string): boolean {
		return true;
	}

	public transform(input: string): string {
		const output = JSON.parse(input);
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
		const buffer = Buffer.from(input, 'base64');
		const data = buffer.toJSON().data;
		const output = JSON.stringify(data);

		return output;
	}
}
