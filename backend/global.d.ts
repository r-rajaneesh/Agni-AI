// global.d.ts

import { type Tool } from "ollama";

declare global {
	interface CTool extends Tool {
		execute?: (...args: any[]) => void;
	}
}
