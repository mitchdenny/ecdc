import * as core from './core';
const enc = require('encode32');

export class CrockfordBase32ToIntegerTransformer implements core.Transformer {
	public get label(): string {
		return 'Crockford Base32 to Integer';
	}

	public get description(): string {
		return this.label;
	}

	public check(input: string): boolean {
		return true;
	}

	public transform(input: string): string {
		const result = enc.decode32(input);
		return String(result);
	}
}

export class IntegerToCrockfordBase32Transformer implements core.Transformer {
	public get label(): string {
		return 'Integer to Crockford Base32';
	}

	public get description(): string {
		return this.label;
	}

	public check(input: string): boolean {
		return true;
	}

	public transform(input: string): string {
		const inputAsInteger = Number.parseInt(input);
		return enc.encode32(inputAsInteger);
	}
}

