import ollama, { Ollama } from "ollama";

export default {
	type: "function",
	function: {
		name: "webFetch",
		description: "Fetch contents of a webpage (single page only)",
		type: "object",
		parameters: {
			properties: {
				url: { type: "string", description: "The webpage url" },
			},
			required: ["url"],
		},
	},
	execute: async (params: { url: string }) => {
		return await new Ollama({ headers: { Authorization: `Bearer ${Bun.env.OLLAMA_API}` } }).webFetch({
			url: params.url,
		});
	},
} as CTool;
