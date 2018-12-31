import * as core from './core';
import { escape } from 'querystring';

export class StringToEncodedUrlTransformer implements core.Transformer {
	public get label(): string {
		return 'String to Encoded Url';
	}

	public get description(): string {
		return this.label;
	}

	public check(input: string): boolean {
		return true;
	}

	public transform(input: string): string {
		var output = escape(input);

		return output;
	}
}

export class EncodedUrlToStringTransformer implements core.Transformer {
	public get label(): string {
		return "Encoded Url to String";
	}

	public get description(): string {
		return this.label;
	}

	public check(input: string): boolean {
		return true;
	}

	public transform(input: string): string {
		var output = unescape(input);

		return output;
	}
}

