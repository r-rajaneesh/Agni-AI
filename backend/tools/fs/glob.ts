import fs from "fs-extra";
const glob = async (globPattern: string) => {
	const glob_contents = await fs.globSync(globPattern);
	return glob_contents;
};
export default glob;
