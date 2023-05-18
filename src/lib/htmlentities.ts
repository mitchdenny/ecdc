import * as core from './core';
const ent = require('ent');

export class HtmlEntitiesToStringTransformer implements core.Transformer {
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
		const output = ent.decode(input);
		return output;
	}
}

export class StringToHtmlEntitiesTransformer implements core.Transformer {
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
		const output = ent.encode(input, { named: true });
		return output;
	}
}

export class StringToHtmlDecimalEntitiesTransformer implements core.Transformer {
	public get label(): string {
		return 'String to HTML Entities (as Decimal Entity)';
	}

	public get description(): string {
		return this.label;
	}

	public check(input: string): boolean {
		return true;
	}

	public transform(input: string): string {
		const output = ent.encode(input, { named: false });
		return output;
	}
}
