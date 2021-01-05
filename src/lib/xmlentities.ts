import * as core from './core';
var entities = require('html-entities');

export class XmlEntitiesToStringTransformer implements core.Transformer {
	public get label(): string {
		return 'XML Entities to String';	
	}
	
	public get description(): string {
		return this.label;
	}
	
	public check(input: string): boolean {
		return true;
	}
	
	public transform(input: string): string {
		let output = entities.decode(input, {level: 'xml'});
		return output;
	}
}

export class StringToXmlEntitiesTransformer implements core.Transformer {
	public get label(): string {
		return 'String to XML Entities';	
	}
	
	public get description(): string {
		return this.label;
	}
	
	public check(input: string): boolean {
		return true;
	}
	
	public transform(input: string): string {
		let output = entities.encode(input, {level: 'xml'});
		return output;
	}
}

