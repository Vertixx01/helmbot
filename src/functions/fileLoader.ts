import { glob } from "glob";

async function loadFiles(folderName: string) {
    const files = glob(`${process.cwd().replace(/\\/g, "/")}/${folderName}/**/*.ts`);
    (await files).forEach((file: any) => {
        delete require.cache[require.resolve(file)];
    });
    return files;
}

export default loadFiles;
