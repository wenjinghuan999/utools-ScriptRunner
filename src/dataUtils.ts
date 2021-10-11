import { DBDirs, DBScripts } from "./dbUtils";
import { SearchDBDirItem } from './types';
import { getBasename } from './commonUtils';

export class Data {
    private static dbDirs = new DBDirs();
    private static dbScripts = new DBScripts();

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
        this.dbDirs.load();
        return this.dbDirs.data;
    }

    public static searchDir(searchWord: string): SearchDBDirItem[] {
        this.dbDirs.load();
        const lowerSearchWord = searchWord.toLocaleLowerCase();
        const results: SearchDBDirItem[] = [];
        this.dbDirs.data.forEach(url => {
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
        this.dbScripts.load();
        if (!this.dbScripts.data[dir]) {
            return [];
        } else {
            return this.dbScripts.data[dir];
        }
    }

    public static getAllScripts(): Record<string, string[]> {
        this.dbScripts.load();
        return this.dbScripts.data;
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
}