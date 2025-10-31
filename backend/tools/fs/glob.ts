import fs from "fs-extra";
import type { Tool } from "ollama";
const glob = async (globPattern: string) => {
	const glob_contents = await fs.globSync(globPattern);
	return glob_contents;
};
export default {
	type: "function",
	function: {
		name: "glob",
		description: "Glob all similar files with similar names.",
		parameters: {
			type: "object",
			filePath: { type: String, description: "Glob Path to search via glob pattern." },
		},
	},
} as Tool;
