import { Ollama } from "ollama";

export default {
	type: "function",
	function: {
		name: "webSearch",
		description: "Search websites based on query",
		type: "object",
		parameters: {
			properties: {
				query: { type: "string", description: "The query used to search the web" },
			},
			required: ["query"],
		},
	},
	execute: async (params: { query: string }) => {
		return await new Ollama({ headers: { Authorization: `Bearer ${Bun.env.OLLAMA_API}` } }).webFetch({
			url: params.query,
		});
	},
} as CTool;
