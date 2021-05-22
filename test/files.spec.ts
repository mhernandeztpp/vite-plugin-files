import { resolve } from "path";
import { resolveOptions } from "../src/options";
import { getTrees } from "../src/files";

const options = resolveOptions({
    exclude: [/components/]
});
const testDir = "./test/files";
const testAbsoluteDir = resolve(testDir);
const expectFiles = {
    name: "files",
    type: "directory",
    path: "/Users/morelearn/project/vite/vite-plugin-files/test/files",
    relativePath: "./test/files/",
    extension: undefined,
    children: [
        {
            extension: "ts",
            name: "a.ts",
            path: "/Users/morelearn/project/vite/vite-plugin-files/test/files/a.ts",
            relativePath: "./test/files/a.ts",
            type: "file"
        },
        {
            extension: undefined,
            name: "b",
            path: "/Users/morelearn/project/vite/vite-plugin-files/test/files/b",
            relativePath: "./test/files/b",
            type: "directory",
            children: [
                {
                    extension: "ts",
                    name: "c.ts",
                    path: "/Users/morelearn/project/vite/vite-plugin-files/test/files/b/c.ts",
                    relativePath: "./test/files/b/c.ts",
                    type: "file"
                },
                {
                    extension: undefined,
                    name: "d",
                    path: "/Users/morelearn/project/vite/vite-plugin-files/test/files/b/d",
                    relativePath: "./test/files/b/d",
                    type: "directory",
                    children: [
                        {
                            extension: "ts",
                            name: "e.ts",
                            path: "/Users/morelearn/project/vite/vite-plugin-files/test/files/b/d/e.ts",
                            relativePath: "./test/files/b/d/e.ts",
                            type: "file"
                        }
                    ]
                }
            ]
        }
    ]
};

describe("Get files", () => {
    test("tree file", async () => {
        const files = await getTrees(testAbsoluteDir, testDir, options);
        expect(files).toEqual(expectFiles);
    });
});
