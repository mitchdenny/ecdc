import * as crypto from 'crypto';
import * as core from './core';

abstract class StringToHashTransformer implements core.Transformer {
	protected abstract get digestMethodDescription(): string
	protected abstract get digestMethod(): crypto.HexBase64Latin1Encoding
	protected abstract get hashFunction(): string
	protected abstract get hashFunctionDescription(): string

	public  get label(): string {
		return `String to ${this.hashFunctionDescription} Hash (${this.digestMethodDescription})`;
	}

	public get description(): string {
		return this.label;
	}

	public check(input: string): boolean {
		return true;
	}

	public transform(input: string): string {
		let hash = crypto.createHash(this.hashFunction);
		hash.update(input, 'utf8');

		let output = hash.digest(this.digestMethod);
		return output;
	}
}

export class StringToMD5Base64Transformer extends StringToHashTransformer{
	protected get hashFunction(): string {
		return "md5"
	}
 
	protected get hashFunctionDescription(): string {
		return "MD5"
	}
 
	protected get digestMethodDescription(): string {
		return "as Base64"
	}

	protected get digestMethod(): crypto.HexBase64Latin1Encoding {
		return "base64"
	}
}

export class StringToMD5HexTransformer extends StringToHashTransformer {
	protected get hashFunction(): string {
		return "md5"
	}
 
	protected get hashFunctionDescription(): string {
		return "MD5"
	}

	protected get digestMethodDescription(): string {
		return "as Hex"
	}

	protected get digestMethod(): crypto.HexBase64Latin1Encoding {
		return "hex"
	}
}

export class StringToSHA1Base64Transformer extends StringToHashTransformer{
	protected get hashFunction(): string {
		return "sha1"
	}
 
	protected get hashFunctionDescription(): string {
		return "SHA1"
	}

	protected get digestMethodDescription(): string {
		return "as Base64"
	}

	protected get digestMethod(): crypto.HexBase64Latin1Encoding {
		return "base64"
	}
}

export class StringToSHA1HexTransformer extends StringToHashTransformer {
	protected get hashFunction(): string {
		return "sha1"
	}
 
	protected get hashFunctionDescription(): string {
		return "SHA1"
	}

	protected get digestMethodDescription(): string {
		return "as Hex"
	}

	protected get digestMethod(): crypto.HexBase64Latin1Encoding {
		return "hex"
	}
}

export class StringToSHA256Base64Transformer extends StringToHashTransformer{
	protected get hashFunction(): string {
		return "sha256"
	}
 
	protected get hashFunctionDescription(): string {
		return "SHA256"
	}

	protected get digestMethodDescription(): string {
		return "as Base64"
	}

	protected get digestMethod(): crypto.HexBase64Latin1Encoding {
		return "base64"
	}
}

export class StringToSHA256HexTransformer extends StringToHashTransformer {
	protected get hashFunction(): string {
		return "sha256"
	}
 
	protected get hashFunctionDescription(): string {
		return "SHA256"
	}

	protected get digestMethodDescription(): string {
		return "as Hex"
	}

	protected get digestMethod(): crypto.HexBase64Latin1Encoding {
		return "hex"
	}
}



export class StringToSHA512Base64Transformer extends StringToHashTransformer{
	protected get hashFunction(): string {
		return "sha512"
	}
 
	protected get hashFunctionDescription(): string {
		return "SHA512"
	}

	protected get digestMethodDescription(): string {
		return "as Base64"
	}

	protected get digestMethod(): crypto.HexBase64Latin1Encoding {
		return "base64"
	}
}

export class StringToSHA512HexTransformer extends StringToHashTransformer {
	protected get hashFunction(): string {
		return "sha512"
	}
 
	protected get hashFunctionDescription(): string {
		return "SHA512"
	}

	protected get digestMethodDescription(): string {
		return "as Hex"
	}

	protected get digestMethod(): crypto.HexBase64Latin1Encoding {
		return "hex"
	}
}


