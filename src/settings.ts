export class CommonSettings {
    public env: string = '';

    constructor() {
        if (window.utools.isWindows()) {
            this.env = '';
        } else {
            this.env = ':/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin';
        }
    }

    public static isCommonSettings(inData: any): inData is CommonSettings {
        return typeof(inData.env) === 'string';
    }
}

export class GlobalSettings {
    public createFeature: boolean = true;
    public searchSubFolders: boolean = true;

    public static isGlobalSettings(inData: any): inData is GlobalSettings {
        return inData.createFeature !== undefined && inData.searchSubFolders !== undefined;
    }
}

export class FileTypeSettingItem {
    public readonly name: string;
    public pattern: string;
    public extname: string;
    public command: string;
    
    public constructor(name: string, pattern: string, extname: string, command: string) {
        this.name = name;
        this.pattern = pattern;
        this.extname = extname;
        this.command = command;
    }

    public static getId(name: string): string {
        return name.replaceAll(/\W+/g, '-').toLowerCase();
    }
}

export class LocalSettings {
    public commonSettings = new CommonSettings();
    public fileTypes: Record<string, FileTypeSettingItem> = {};

    constructor() {
        this.fileTypes = LocalSettings.buildDefaultFileTypes();
    }

    static buildDefaultFileTypes(): Record<string, FileTypeSettingItem> {
        if (window.utools.isWindows()) {
            return LocalSettings.buildFileTypes([
                ['Python', '\\.py$', '.py', 'python'],
                ['Node.js', '\\.js$', '.js', 'node'],
                ['Batch file', '\\.bat$', '.bat', ''],
            ]);
        } else {
            return LocalSettings.buildFileTypes([
                ['Python', '\\.py$', '.py', 'python'],
                ['Node.js', '\\.js$', '.js', 'node'],
                ['Bash', '\\.sh$', '.sh', 'bash'],
            ]);
        }
    }

    static buildFileTypes(fileTypesArr: [string, string, string, string][]): Record<string, FileTypeSettingItem> {
        const fileTypes: Record<string, FileTypeSettingItem> = {};
        fileTypesArr.forEach(item => {
            fileTypes[item[0]] = new FileTypeSettingItem(item[0], item[1], item[2], item[3]);
        });
        return fileTypes;
    }

    public static isLocalSettings(inData: any): inData is LocalSettings {
        return CommonSettings.isCommonSettings(inData.commonSettings) && inData.fileTypes !== undefined;
    }
}
