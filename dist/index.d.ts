import { Plugin } from "vite";

interface PageDirOptions {
    dir: string;
    [key: string]: string;
}
interface GeneratorFile {
    name: string;
    type: string;
    path: string;
    relativePath: string;
    extension?: string | undefined;
}
interface GeneratorTree extends GeneratorFile {
    children?: GeneratorTree[];
}
declare type GeneratedTrees = [GeneratorTree, PageDirOptions][];
declare type OnFilterFile = (file: string) => boolean | Promise<boolean>;
declare type ClientCode = string;
declare type OnGeneratedClient = (trees: GeneratedTrees, options: Options) => ClientCode;
/**
 * Plugin options.
 */
interface Options {
    /**
     * Plugin name
     * @default 'vite-plugin-files'
     */
    name: string;
    /**
     * Plugin virtualId
     * @default 'generated-files'
     */
    virtualId: string;
    /**
     * Relative path to the directory to search for page components.
     * @default 'src'
     */
    filesDir: string | string[] | PageDirOptions[];
    /**
     * Valid file extensions for page components.
     * @default ['js', 'ts']
     */
    extensions: string[];
    /**
     * List of path globs to exclude when resolving files.
     */
    exclude: RegExp[];
    /**
     * Custom filter file
     */
    onFilterFile: OnFilterFile;
    /**
     * Custom generated client code
     */
    onGeneratedClient: OnGeneratedClient;
}
declare type UserOptions = Partial<Options>;
interface ResolvedOptions extends Options {
    /**
     * viteServer moduleId
     */
    virtualModuleId: string;
    /**
     * Resolves to the `root` value from Vite config.
     * @default config.root
     */
    root: string;
    /**
     * Page Dir as a normalized array of PageDirOptions
     */
    dirOptions: PageDirOptions[];
    /**
     * match file when file add or unlink
     */
    extensionsReg: RegExp;
}
declare type ExportPlugin = Required<
    Pick<Plugin, "name" | "enforce" | "configResolved" | "configureServer" | "resolveId" | "load">
>;

declare function filesPlugin(userOptions: UserOptions): ExportPlugin;

export default filesPlugin;
export {
    ClientCode,
    ExportPlugin,
    GeneratedTrees,
    GeneratorFile,
    GeneratorTree,
    OnFilterFile,
    OnGeneratedClient,
    PageDirOptions,
    ResolvedOptions,
    UserOptions
};
