import fs from "fs-extra";
import type { Tool } from "ollama";
const readDir = async (dirPath: string ="./") => {
	const dir_contents = await fs.readdirSync(dirPath);
	return dir_contents;
};
export default {
	type: "function",
	function: {
		name: "readDir",
		description: "Read all files inside a directory.",
		parameters: {
			type: "object",
			dirPath: { type: String, description: "Directory Path to search." },
		},
	},
} as Tool;
