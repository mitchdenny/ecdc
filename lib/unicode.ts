import * as core from './core';
var escape = require('unicode-escape');

export class StringToUnicodeTransformer implements core.Transformer {
	public get label(): string {
		return 'String to Unicode';
	}

	public get description(): string {
		return this.label;
	}

	public check(input: string): boolean {
		return true;
	}

	public transform(input: string): string {
		return escape(input);
	}
}

export class UnicodeToStringTransformer implements core.Transformer {
	public get label(): string {
		return "Unicode to String";
	}

	public get description(): string {
		return this.label;
	}

	public check(input: string): boolean {
		return true;
	}

	public transform(input: string): string {
		return eval('("' + input + '")');
	}
}

