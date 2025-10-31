import fs from "fs-extra";
import type { Tool } from "ollama";
const readFile = async (params: { filePath: string }) => {
	try {
		const file_contents = await fs.readFileSync(params.filePath).toString();
		return file_contents;
	} catch (error) {
		return `Some error occoured while reading ${params.filePath}, maybe a directory.`;
	}
};
export default {
	type: "function",
	function: {
		name: "readFile",
		description: "Read contents of file.",
		parameters: {
			type: "object",
			properties: {
				filePath: { type: "string", description: "File Path to search and manipulate." },
			},
		},
	},
	execute: readFile,
} as CTool;
