import * as core from './core';
var yaml = require('js-yaml');

export class JsonToYamlTransformer implements core.Transformer {
	public get label(): string {
		return 'JSON to YAML';
	}

	public get description(): string {
		return this.label;
	}

	public check(input: string): boolean {
		return true;
	}

	public transform(input: string): string {
		let parsedInput = JSON.parse(input);
		let output = yaml.dump(parsedInput);

		return output;
	}
}

export class YamlToJsonTransformer implements core.Transformer {
	public get label(): string {
		return 'YAML to JSON';
	}

	public get description(): string {
		return this.label;
	}

	public check(input: string): boolean {
		return true;
	}

	public transform(input: string): string {
		var parsedInput = yaml.load(input);
		let output = JSON.stringify(parsedInput);

		return output;
	}
}
