// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

const extensionConfigPath = "coders-little-helper";
enum ConfigKeys {
    sourceDirectory = "sourceDirectoryPath",
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "coders-little-helper" is now active!');

    let testCommand = vscode.commands.registerCommand("coders-little-helper.genreactcomponent", () => {
        vscode.window.showInformationMessage("Generating React Component Files...");
        const root: any = vscode.workspace.workspaceFolders;
        console.log(root);
        vscode.workspace.fs.readDirectory(root[0].uri).then((data) => console.log(data));
    });

    let setPathCommand = vscode.commands.registerCommand("coders-little-helper.setcomppath", async () => {
        vscode.window.showInformationMessage("Setting Component Path...");
        console.log("Comp Path Command");

        let rootDirURI: any = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri : "No Workspace Folder";
        let pathUndefined: boolean = true;
        const root: any = vscode.workspace.workspaceFolders;
        const path: string[] = [];
        let currentDir: any = root[0].uri;

        const getPath = (pathObj: string[]) => {
            let stringifiedPath = rootDirURI;
            for (let path of pathObj) {
                // console.log(path);
                stringifiedPath = `${stringifiedPath}/${path}`;
                // console.log(stringifiedPath);
            }
            console.log(`getPath -> "${stringifiedPath}"`);
            return stringifiedPath;
        };

        const useConfig = (configKey: ConfigKeys, log: boolean = false): [data: any, setData: (val: any) => void] => {
            type DataType = string | number | {} | undefined;

            const config = vscode.workspace.getConfiguration();

            const getData = (): DataType => {
                const configData: DataType = config.get(`${extensionConfigPath}.${configKey}`);
                console.log(`Data Type -> ${typeof configData}`);
                const formattedData: DataType = typeof configData === "object" ? JSON.stringify(configData) : configData;
                if (log) console.log(`getConfig -> ${formattedData}`);
                return configData;
            };

            let data = getData();

            const setData = (val: any) => {
                config.update(`${extensionConfigPath}.${configKey}`, val, true);
                if (log) console.log(`setConfig:  ${extensionConfigPath}.${configKey} -> ${val}`);
                data = val;
            };

            return [data, setData];
        };

        console.log(`RootDirURI: ${rootDirURI}`);
        while (pathUndefined) {
            const dirs = await vscode.workspace.fs.readDirectory(currentDir).then((data) => data);
            const dirArr: any[] = dirs.map((data: any) => {
                return { label: data[0] };
            });
            dirArr.unshift({ label: "Select This Directory" });
            // console.log(dirs, dirArr);
            // console.log("Loop Started");
            await vscode.window.showQuickPick(dirArr).then((selection) => {
                // console.log(selection);
                if (selection.label === "Select This Directory") {
                    console.log(`Selected Dir: ${currentDir}`);
                    pathUndefined = false;
                    return;
                }
                path.push(selection.label);
                // console.log(path);
                currentDir = vscode.Uri.parse(getPath(path));

                // currentDir = vscode.Uri.file("/MockWorkspace/src");
                // console.log(`CurrentDir: ${currentDir}`);
            });
        }

        // Dir Selected
        const [configData, setConfigData] = useConfig(ConfigKeys.sourceDirectory, true);
        console.log(`URI: ${currentDir}`);
        setConfigData(currentDir);
        console.log(configData);

        // const sourceDir = vscode.Uri.parse(configSrcDir.external);
        // console.log({ configSrcDir, sourceDir });
        // const dirs = await vscode.workspace.fs.readDirectory(configSrcDir).then((data) => data);
        // console.log(dirs);
        // vscode.workspace.fs.writeFile(currentDir, Buffer.from("foo"));
    });

    context.subscriptions.push(testCommand);
    context.subscriptions.push(setPathCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {}
