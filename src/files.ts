import { scanAsync, Dree } from "dree";
import { ResolvedOptions, onFilterFile, GeneratorTree } from "./types";

export async function getTrees(
    absolutePath: string,
    relativePath: string,
    options: ResolvedOptions
): Promise<GeneratorTree> {
    const { extensions, exclude = [] } = options;

    const files = await scanAsync(absolutePath, {
        normalize: true,
        sizeInBytes: false,
        size: false,
        exclude: [/node_modules/, /.git/, /\*\*\/__\*__\/\*\*/, ...exclude],
        extensions
    });
    return generateFileTree(files, relativePath, options);
}

function generateFileTree(tree: Dree, rootPath: string, options: ResolvedOptions): GeneratorTree {
    const { onFilterFile } = options;

    function recursiveFileTree(tree: Dree) {
        const { relativePath, path, type, children, name, extension } = tree;
        let generateTree: GeneratorTree = {
            name,
            path,
            type,
            extension,
            relativePath: `${rootPath}/${relativePath == "." ? "" : relativePath}`
        };

        if (children && children.length > 0) {
            generateTree.children = children
                .map((el) => recursiveFileTree(el))
                .filter((el) => el.type !== "file" || onFilterFile(el.path));
        }

        return generateTree;
    }

    return tree && recursiveFileTree(tree);
}
