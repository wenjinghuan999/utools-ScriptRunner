import { SearchDiskDirItem, SearchDBDirItem, SearchDBScriptItem } from './types';
import { getBasename } from './commonUtils';
import path from 'path';

export interface UToolsListItem {
    title: string;
    description: string;
    icon: string;
};

export class DiskDirListItem implements UToolsListItem {
    public title: string;
    public description: string;
    public icon: string;
    public searchItem: SearchDiskDirItem;

    constructor(item: SearchDiskDirItem) {
        this.searchItem = item;
        if (item.accurate) {
            this.title = '添加选定目录：' + getBasename(item.url);
        } else {
            this.title = getBasename(item.url);
        }
        this.description = item.url;
        this.icon = window.utools.getFileIcon(item.url);
    }
};

export class DBDirListItem implements UToolsListItem {
    public title: string;
    public description: string;
    public icon: string;
    public searchItem: SearchDBDirItem;

    constructor(item: SearchDBDirItem) {
        this.searchItem = item;
        if (item.fake) {
            this.title = '没有已添加的监视目录';
            this.description = '使用“脚本运行添加目录”、“Add Folder for ScriptRunner”等关键字添加监视目录';
            this.icon = '';
        } else {
            this.title = item.basename;
            this.description = item.url;
            this.icon = window.utools.getFileIcon(item.url);
        }
    }
};

export class ClearAllDirsListItem implements UToolsListItem {
    public title: string;
    public description: string;
    public icon: string;
    public confirmed: boolean;

    constructor(searchWord: string) {
        this.icon = '';
        if (searchWord == 'Confirm Clear') {
            this.title = '清空所有监视目录';
            this.description = '注意：清空操作无法恢复';
            this.confirmed = true;
        }
        else {
            this.title = '注意：清空操作无法恢复';
            this.description = '在输入框中输入“Confirm Clear”并按回车，以清空所有监视目录';
            this.confirmed = false;
        }
    }
};

export class RefreshScriptsListItem implements UToolsListItem {
    public title: string;
    public description: string;
    public icon: string;

    constructor() {
        this.title = '重新扫描所有监视目录';
        this.description = '';
        this.icon = '';
    }
};

export class DBScriptListItem implements UToolsListItem {
    public title: string;
    public description: string;
    public icon: string;
    public searchItem: SearchDBScriptItem;

    constructor(item: SearchDBScriptItem) {
        this.searchItem = item;

        this.title = path.basename(item.url);
        this.description = item.url + "（位于监视目录：" + item.dir + "）";
        this.icon = window.utools.getFileIcon(item.url);
    }
};

export class PushScriptListItem {
    public text: string;
    public icon: string;
    public title: string;
    public searchItem: SearchDBScriptItem;

    constructor(item: SearchDBScriptItem) {
        this.searchItem = item;
        
        this.text = path.basename(item.url) + "（位于监视目录：" + item.dir + "）";
        this.title = item.url;
        this.icon = 'python.png';
    }
};