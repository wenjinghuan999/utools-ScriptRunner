import { DBDirs, DBScripts, DBLocalSettings, DBGlobalSettings } from "./dbUtils";
import { SearchDBDirItem } from './types';
import { getBasename } from './commonUtils';
import { FileTypeSettingItem, GlobalSettings, LocalSettings } from "./settings";

export class Data {
    private static dbDirs = new DBDirs();
    private static dbScripts = new DBScripts();
    private static dbLocalSettings = new DBLocalSettings();
    private static dbGlobalSettings = new DBGlobalSettings();

    public static addDir(dir: string): boolean {
        this.dbDirs.load();
        if (this.dbDirs.data.indexOf(dir) < 0) {
            this.dbDirs.data.push(dir);
            this.dbDirs.store();
            return true;
        }
        return false;
    }

    public static getAllDirs(): string[] {
        return this.dbDirs.load();
    }

    public static searchDir(searchWord: string): SearchDBDirItem[] {
        const allDirs = this.dbDirs.load();
        const lowerSearchWord = searchWord.toLocaleLowerCase();
        const results: SearchDBDirItem[] = [];
        allDirs.forEach(url => {
            const lowerUrl = url.toLocaleLowerCase();
            let pos = searchWord ? lowerUrl.indexOf(lowerSearchWord) : 0;
            if (pos >= 0) {
                const basename = getBasename(url);
                const posBase = searchWord ? basename.toLocaleLowerCase().indexOf(lowerSearchWord) : 0;
                pos = posBase >= 0 ? posBase - 10000 : pos;
                results.push({
                    url: url,
                    basename: basename,
                    searchWordIdx: pos,
                    fake: false
                });
            }
        });
        results.sort((a, b) => {
            return a.searchWordIdx == b.searchWordIdx ? a.basename.localeCompare(b.basename) : a.searchWordIdx - b.searchWordIdx;
        });
        if (!results || results.length == 0) {
            results.push({
                url: '',
                basename: '',
                searchWordIdx: -1,
                fake: true
            });
        }
        return results;
    }

    public static removeDir(url: string): boolean {
        this.dbDirs.load();
        const idx = this.dbDirs.data.indexOf(url);
        if (idx >= 0) {
            this.dbDirs.data.splice(idx, 1);
            this.dbDirs.store();
            return true;
        }
        return false;
    }

    public static clearDirs() {
        this.dbDirs.data = [];
        this.dbDirs.store();
    }

    public static addScripts(dir: string, scripts: string[]) {
        this.dbScripts.load();
        if (this.dbScripts.data[dir] === undefined) {
            this.dbScripts.data[dir] = [];
        }
        scripts.forEach(file => {
            if (this.dbScripts.data[dir].indexOf(file) < 0) {
                this.dbScripts.data[dir].push(file);
            }
        })
        this.dbScripts.store();
    }

    public static getScripts(dir: string): string[] {
        const scripts = this.dbScripts.load();
        if (!scripts[dir]) {
            return [];
        } else {
            return scripts[dir];
        }
    }

    public static getAllScripts(): Record<string, string[]> {
        return this.dbScripts.load();
    }

    public static removeScripts(dir: string) {
        this.dbScripts.load();
        if (!this.dbScripts.data[dir]) {
            return;
        }
        delete this.dbScripts.data[dir];
        this.dbScripts.store();
    }

    public static removeAllScripts() {
        this.dbScripts.data = {};
        this.dbScripts.store();
    }

    public static getLocalSettings(): LocalSettings {
        return this.dbLocalSettings.load();
    }

    public static setLocalSettings(settings: LocalSettings) {
        this.dbLocalSettings.data = settings;
        this.dbLocalSettings.store();
    }

    public static getGlobalSettings(): GlobalSettings {
        return this.dbGlobalSettings.load();
    }

    public static setGlobalSettings(settings: GlobalSettings) {
        this.dbGlobalSettings.data = settings;
        this.dbGlobalSettings.store();
    }

    public static getAllowPatterns(): RegExp[] {
        const settings = this.dbLocalSettings.load();
        const patterns: RegExp[] = [];
        for (const id in settings.fileTypes) {
            const fileType = settings.fileTypes[id];
            patterns.push(new RegExp(fileType.pattern, 'i'));
        }
        return patterns;
    }

    public static findFileType(script: string): FileTypeSettingItem | null {
        const settings = this.dbLocalSettings.load();
        for (const id in settings.fileTypes) {
            const fileType = settings.fileTypes[id];
            if (script.match(fileType.pattern)) {
                return fileType;
            }
        }
        return null;
    }
}