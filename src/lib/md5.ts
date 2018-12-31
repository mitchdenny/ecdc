import * as core from './core';
import * as crypto from 'crypto';

export class StringToMD5Transformer implements core.Transformer {
	public get label(): string {
		return 'String to MD5 Hash (Base64 Encoded)';
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

		let output = hash.digest('base64');
		return output;
	}
}