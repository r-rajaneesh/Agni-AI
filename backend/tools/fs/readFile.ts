import fs from "fs-extra";
import type { Tool } from "ollama";
const readFile = async (filePath: string) => {
	const file_contents = await fs.readFileSync(filePath);
	return file_contents;
};
export default {
	type: "function",
	function: {
		name: "readFile",
		description: "Read contents of file.",
		parameters: {
			type: "object",
			filePath: { type: String, description: "File Path to search and manipulate." },
		},
	},
} as Tool;
