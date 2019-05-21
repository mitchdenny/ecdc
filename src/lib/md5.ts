import * as crypto from 'crypto';
import * as core from './core';

abstract class StringToMD5Transformer implements core.Transformer {
	protected abstract get digestMethodDescription(): string
	protected abstract get digestMethod(): crypto.HexBase64Latin1Encoding

	public  get label(): string {
		return `String to MD5 Hash (${this.digestMethodDescription})`;
	}

	public get description(): string {
		return this.label;
	}

	public check(input: string): boolean {
		return true;
	}

	public transform(input: string): string {
		let hash = crypto.createHash('md5');
		hash.update(input, 'utf8');

		let output = hash.digest(this.digestMethod);
		return output;
	}
}

export class StringToMD5Base64Transformer extends StringToMD5Transformer{
	protected get digestMethodDescription(): string {
		return "Base64 Encoded"
	}

	protected get digestMethod(): crypto.HexBase64Latin1Encoding {
		return "base64"
	}
}

export class StringToMD5HexTransformer extends StringToMD5Transformer {
	protected get digestMethodDescription(): string {
		return "Hex"
	}

	protected get digestMethod(): crypto.HexBase64Latin1Encoding {
		return "hex"
	}
}
