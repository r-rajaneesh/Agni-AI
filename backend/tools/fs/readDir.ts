import fs from "fs-extra";
import type { Tool } from "ollama";
const readDir = async (params: { dirPath: string }) => {
	try {
		const dir_contents = await fs.readdirSync(params.dirPath);
		return dir_contents;
	} catch (error) {
		return "There was an error executing that.";
	}
};
export default {
	type: "function",
	function: {
		name: "readDir",
		description: "Read all files inside a directory.",
		parameters: {
			type: "object",
			properties: {
				dirPath: { type: "string", description: "Directory Path to search. (Defaults ./)" },
			},
		},
	},
	execute: readDir,
} as CTool;
