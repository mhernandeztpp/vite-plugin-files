"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/index.ts
var _path = require('path');

// src/utils.ts

function flattenTree(trees, onFilterFile = () => true) {
  let flattenedFiles = [];
  const innerTrees = trees.map((el) => el[0]);
  function recurseFlatten(trees2) {
    trees2.forEach((el) => {
      const {name, path, relativePath, extension, type, children} = el;
      onFilterFile(el) && flattenedFiles.push({name, path, relativePath, extension, type});
      if (children && children.length > 0)
        recurseFlatten(children);
    });
  }
  recurseFlatten(innerTrees);
  return flattenedFiles;
}
function isDir(file, options) {
  for (const page of options.dirOptions) {
    const dirPath = slash(_path.resolve.call(void 0, options.root, page.dir));
    if (file.startsWith(dirPath))
      return true;
  }
  return false;
}
function isTarget(file, options) {
  return isDir(file, options) && options.extensionsReg.test(file);
}
function slash(str) {
  return str.replace(/\\/g, "/");
}

// src/options.ts
var onGeneratedClientDefault = (trees) => {
  const files = flattenTree(trees, (el) => el.type == "file");
  const keyArray = [];
  return `${files.map((el) => {
    let relativePathWithoutExtension = el.relativePath.substring(0, el.relativePath.lastIndexOf(".")).replace(/[\W_](\w)/g, (str) => {
      return str.toUpperCase();
    }).replace(/[\W_]/g, "");
    keyArray.push(relativePathWithoutExtension);
    return `import ${relativePathWithoutExtension} from "${el.path}";`;
  }).join("\n")}
export default {
  ${keyArray.join(",\n  ")}
}
`;
};
function resolveOptions(userOptions) {
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
  let dirOptions = [];
  if (typeof filesDir === "string") {
    dirOptions = dirOptions.concat({dir: filesDir});
  } else {
    for (const dir of filesDir) {
      if (typeof dir === "string")
        dirOptions = dirOptions.concat({dir});
      else if (dir)
        dirOptions = dirOptions.concat(dir);
    }
  }
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

// src/files.ts
var _dree = require('dree');
async function getTrees(absolutePath, relativePath, options) {
  const {extensions, exclude = []} = options;
  const files = await _dree.scanAsync.call(void 0, absolutePath, {
    normalize: true,
    sizeInBytes: false,
    size: false,
    exclude: [/node_modules/, /\.git/, /\*\*\/__\*__\/\*\*/, ...exclude],
    extensions
  });
  return generateFileTree(files, relativePath, options);
}
function generateFileTree(tree, rootPath, options) {
  const {onFilterFile} = options;
  function recursiveFileTree(tree2) {
    const {relativePath, path, type, children, name, extension} = tree2;
    let generateTree = {
      name,
      path,
      type,
      extension,
      relativePath: `${rootPath}/${relativePath == "." ? "" : relativePath}`
    };
    if (children && children.length > 0) {
      generateTree.children = children.map((el) => recursiveFileTree(el)).filter((el) => el.type !== "file" || onFilterFile(el.path));
    }
    return generateTree;
  }
  return tree && recursiveFileTree(tree);
}

// src/index.ts
function filesPlugin(userOptions) {
  const options = resolveOptions(userOptions);
  let clientCode = null;
  return {
    name: options.name,
    enforce: "pre",
    configResolved({root}) {
      options.root = root;
    },
    configureServer(server) {
      const {ws, watcher, moduleGraph} = server;
      function fullReload() {
        const module = moduleGraph.getModuleById(options.virtualModuleId);
        module && moduleGraph.invalidateModule(module);
        clientCode = null;
        ws.send({type: "full-reload", path: options.virtualModuleId});
      }
      watcher.on("add", (file) => isTarget(file, options) && fullReload());
      watcher.on("change", (file) => isTarget(file, options) && options.onFilterFile(file) && fullReload());
      watcher.on("unlink", (file) => isTarget(file, options) && fullReload());
    },
    resolveId(id) {
      return id == options.virtualId ? options.virtualModuleId : null;
    },
    async load(id) {
      if (id !== options.virtualModuleId)
        return;
      if (clientCode)
        return clientCode;
      let generatedTrees = [];
      for (const pageDir of options.dirOptions) {
        const pageDirPath = slash(_path.resolve.call(void 0, options.root, pageDir.dir));
        const generatedTree = await getTrees(pageDirPath, pageDir.dir, options);
        generatedTree && generatedTrees.push([generatedTree, pageDir]);
      }
      clientCode = options.onGeneratedClient(generatedTrees, options);
      return clientCode;
    }
  };
}
var src_default = filesPlugin;


exports.default = src_default;
