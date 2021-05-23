import { resolve } from "path";
import type { Plugin } from "vite";
import { ResolvedOptions, UserOptions, GeneratedTrees } from "./types";
import { resolveOptions } from "./options";
import { getTrees } from "./files";
import { slash, isTarget } from "./utils";

function filesPlugin(userOptions: UserOptions, customVitePlugin: Partial<Plugin> = {}): Plugin {
    const options: ResolvedOptions = resolveOptions(userOptions);
    const { name, enforce, load, resolveId, configureServer, configResolved, ...filteredConfig } = customVitePlugin;
    return {
        name: options.name,
        enforce: "pre",
        configResolved({ root }) {
            options.root = root;
        },
        configureServer(server) {
            const { ws, watcher, moduleGraph } = server;

            function fullReload() {
                const module = moduleGraph.getModuleById(options.virtualModuleId);
                module && moduleGraph.invalidateModule(module);
                ws.send({ type: "full-reload", path: options.virtualModuleId });
            }

            watcher.on("add", (file) => isTarget(file, options) && fullReload());
            watcher.on("change", (file) => isTarget(file, options) && options.onFilterFile(file) && fullReload());
            watcher.on("unlink", (file) => isTarget(file, options) && fullReload());
        },
        resolveId(id) {
            return id == options.virtualId ? options.virtualModuleId : null;
        },
        async load(id) {
            if (id !== options.virtualModuleId) return;

            let generatedTrees: GeneratedTrees = [];
            for (const pageDir of options.dirOptions) {
                const pageDirPath = slash(resolve(options.root, pageDir.dir));

                const generatedTree = await getTrees(pageDirPath, pageDir.dir, options);
                generatedTree && generatedTrees.push([generatedTree, pageDir]);
            }

            const clientCode = options.onGeneratedClient(generatedTrees, options);
            return clientCode;
        },
        ...filteredConfig
    };
}

export * from "./types";
export default filesPlugin;
