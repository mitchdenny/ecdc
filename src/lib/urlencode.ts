import * as core from './core';

export class StringToEncodedUrlTransformer implements core.Transformer {
	public get label(): string {
		return 'String to Encoded Url';
	}

	public get description(): string {
		return 'Encode selection using encodeURI';
	}

	public check(input: string): boolean {
		return true;
	}

	public transform(input: string): string {
		const output = encodeURI(input);

		return output;
	}
}

export class EncodedUrlToStringTransformer implements core.Transformer {
	public get label(): string {
		return "Encoded Url to String";
	}

	public get description(): string {
		return 'Decode selection using decodeURI';
	}

	public check(input: string): boolean {
		return true;
	}

	public transform(input: string): string {
		const output = decodeURI(input);

		return output;
	}
}

export class StringToEncodedUrlComponentTransformer implements core.Transformer {
	public get label(): string {
		return 'String to Encoded Url Component';
	}

	public get description(): string {
		return 'Encode selection using encodeURIComponent';
	}

	public check(input: string): boolean {
		return true;
	}

	public transform(input: string): string {
		const output = encodeURIComponent(input);

		return output;
	}
}

export class EncodedUrlComponentToStringTransformer implements core.Transformer {
	public get label(): string {
		return "Encoded Url Component to String";
	}

	public get description(): string {
		return 'Decode selection using encodeURIComponent';
	}

	public check(input: string): boolean {
		return true;
	}

	public transform(input: string): string {
		const output = decodeURIComponent(input);

		return output;
	}
}

export class StringToEncodedUrlAllCharsTransformer implements core.Transformer {
	public get label(): string {
		return 'String to All Characters Encoded Url ';
	}

	public get description(): string {
		return 'URI encode all selected characters';
	}

	public check(input: string): boolean {
		return true;
	}

	public transform(input: string): string {
		const output = Array.from(input).reduce((p, c) => {
			console.log(c);
			let encoded = encodeURIComponent(c);
			if (encoded === c)
				return p + '%' + c.charCodeAt(0).toString(16).toUpperCase();
			else
				return p + encoded;
		}, '');


		return output;
	}
}
