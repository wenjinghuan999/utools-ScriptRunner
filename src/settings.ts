export class GlobalSetting {
    public createFeature: boolean = true;
    public env: string = '';

    constructor() {
        if (window.utools.isWindows()) {
        } else {
            this.env = ':/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin';
        }
    }
}

export class FileTypeSettingItem {
    public readonly name: string;
    public pattern: string;
    public command: string;
    
    public constructor(name: string, pattern: string, command: string) {
        this.name = name;
        this.pattern = pattern;
        this.command = command;
    }
}

export class Settings {
    public globalSettings = new GlobalSetting();
    public fileTypes: Record<string, FileTypeSettingItem> = {};

    constructor() {
        if (window.utools.isWindows()) {
            this.fileTypes = Settings.buildFileTypes([
                ['Python', '\\.py$', 'python'],
                ['Node.js', '\\.js$', 'node'],
                ['Batch file', '\\.bat$', ''],
            ]);
        } else {
            this.fileTypes = Settings.buildFileTypes([
                ['Python', '\\.py$', 'python'],
                ['Node.js', '\\.js$', 'node'],
                ['Bash', '\\.sh$', 'bash'],
            ]);
        }
    }

    static buildFileTypes(fileTypesArr: [string, string, string][]): Record<string, FileTypeSettingItem> {
        const fileTypes: Record<string, FileTypeSettingItem> = {};
        fileTypesArr.forEach(item => {
            fileTypes[item[0]] = new FileTypeSettingItem(item[0], item[1], item[2]);
        });
        return fileTypes;
    }
}
