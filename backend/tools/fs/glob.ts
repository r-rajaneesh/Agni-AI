import fs from "fs-extra";
import type { Tool } from "ollama";
const glob = async (params: { globPattern: string }) => {
	try {
		const glob_contents = await fs.globSync(params.globPattern);
		return glob_contents;
	} catch (error) {
		return "These was an error executing that.";
	}
};
export default {
	type: "function",
	function: {
		name: "glob",
		description: "Glob all similar files with similar names.",
		parameters: {
			type: "object",
			properties: {
				filePath: { type: "string", description: "Glob Path to search via glob pattern." },
			},
		},
	},
	execute: glob,
} as CTool;
