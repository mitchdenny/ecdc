import * as core from './core';
import * as vscode from 'vscode';

export interface Transformer extends vscode.QuickPickItem {
	check(input: string): boolean;
	transform(input: string): string;
}

