export interface PageDirOptions {
    dir: string;
    [key: string]: string;
}

export interface GeneratorFile {
    name: string;
    type: string;
    path: string;
    relativePath: string;
    extension?: string | undefined;
}
export interface GeneratorTree extends GeneratorFile {
    children?: GeneratorTree[];
}

export type GeneratedTrees = [GeneratorTree, PageDirOptions][];

export type OnFilterFile = (file: string) => boolean | Promise<boolean>;
export type OnGeneratedClient = (trees: GeneratedTrees, options: Options) => string | Promise<string>;

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

export type UserOptions = Partial<Options>;

export interface ResolvedOptions extends Options {
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
