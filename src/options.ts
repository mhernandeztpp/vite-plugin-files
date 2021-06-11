import { UserOptions, ResolvedOptions, PageDirOptions, OnGeneratedClient } from "./types";
import { flattenTree } from "./utils";

const onGeneratedClientDefault: OnGeneratedClient = (trees) => {
    const files = flattenTree(trees, (el) => el.type == "file");

    const keyArray: string[] = [];

    return `${files
        .map((el) => {
            let relativePathWithoutExtension = el.relativePath
                .substring(0, el.relativePath.lastIndexOf("."))
                .replace(/[\W_](\w)/g, (str) => {
                    return str.toUpperCase();
                })
                .replace(/[\W_]/g, "");

            keyArray.push(relativePathWithoutExtension);

            return `import ${relativePathWithoutExtension} from "${el.path}";`;
        })
        .join("\n")}\nexport default {\n  ${keyArray.join(",\n  ")}\n}\n`;
};

export function resolveOptions(userOptions: UserOptions): ResolvedOptions {
    const {
        name = "vite-plugin-files",
        virtualId = "generated-files",
        filesDir = "src",
        extensions = ["js", "ts"],
        exclude = [],
        onFilterFile = () => true,
        onGeneratedClient = onGeneratedClientDefault
    } = userOptions;

    const root = process.cwd();

    let dirOptions: PageDirOptions[] = [];

    if (typeof filesDir === "string") {
        dirOptions = dirOptions.concat({ dir: filesDir });
    } else {
        for (const dir of filesDir) {
            if (typeof dir === "string") dirOptions = dirOptions.concat({ dir });
            else if (dir as PageDirOptions) dirOptions = dirOptions.concat(dir);
        }
    }

    // ['vue','js']=> /(.vue|.js)$/
    const extensionsReg = new RegExp(`(${extensions.map((str) => "." + str).join("|")})$`);

    return Object.assign({}, userOptions, {
        name,
        virtualId: "virtual:" + virtualId,
        virtualModuleId: "/" + virtualId,
        root,
        filesDir,
        extensions,
        extensionsReg,
        exclude,
        dirOptions,
        onGeneratedClient,
        onFilterFile
    });
}
