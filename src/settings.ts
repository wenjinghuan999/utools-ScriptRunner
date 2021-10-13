export class CommonSettings {
    public env: string = '';

    constructor() {
        if (window.utools.isWindows()) {
            this.env = '';
        } else {
            this.env = ':/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin';
        }
    }
}

export class GlobalSettings {
    public createFeature: boolean = true;
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
        if (window.utools.isWindows()) {
            this.fileTypes = LocalSettings.buildFileTypes([
                ['Python', '\\.py$', '.py', 'python'],
                ['Node.js', '\\.js$', '.js', 'node'],
                ['Batch file', '\\.bat$', '.bat', ''],
            ]);
        } else {
            this.fileTypes = LocalSettings.buildFileTypes([
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
}