import { convertToRealpath, convertFromRealpath, searchPathOnDisk } from './fsUtils';
import { Data } from './dataUtils';
import { ClearAllDirsListItem, DBDirListItem, DiskDirListItem, RefreshScriptsListItem, DBScriptListItem, PushScriptListItem } from './listUtils';
import { searchAndAddScriptsAndFeatures, searchAndAddAllScriptsAndFeatures, removeAllScriptsAndFeatures, removeScriptsAndFeatures } from './featureUtils';
import { searchAllScriptCommands } from './searchUtils';
import { runCommand } from './commandUtils';
import { sleep } from './commonUtils';
import { SettingsComponent } from './components/SettingsComponent';

const windowExports = {
    'setup-add': {
        mode: 'list',
        args: {
            enter: (action: any, callbackSetList: Function) => {
                document.getElementById('setting')?.remove();
                convertToRealpath('').then(url => {
                    return searchPathOnDisk(url);
                }).then(items => {
                    callbackSetList(items.map(item => new DiskDirListItem(item)));
                });
            },
            search: (action: any, searchWord: string, callbackSetList: Function) => {
                convertToRealpath(searchWord).then(url => {
                    return searchPathOnDisk(url);
                }).then(items => {
                    callbackSetList(items.map(item => new DiskDirListItem(item)));
                });
            },
            select: (action: any, itemData: DiskDirListItem, callbackSetList: Function) => {
                const dir = itemData.searchItem.url;
                if (!itemData.searchItem.accurate) {
                    convertFromRealpath(dir).then(utools.setSubInputValue);
                }
                else if (Data.addDir(dir)) {
                    utools.hideMainWindow();
                    searchAndAddScriptsAndFeatures(dir).then(() => {
                        utools.outPlugin();
                    });
                }
            },
            placeholder: '要添加的监视目录'
        }
    },
    'setup-remove': {
        mode: 'list',
        args: {
            enter: (action: any, callbackSetList: Function) => {
                document.getElementById('setting')?.remove();
                callbackSetList(Data.searchDir('').map(item => new DBDirListItem(item)))
            },
            search: (action: any, searchWord: string, callbackSetList: Function) => {
                callbackSetList(Data.searchDir(searchWord).map(item => new DBDirListItem(item)))
            },
            select: (action: any, itemData: DBDirListItem, callbackSetList: Function) => {
                if (itemData.searchItem.fake) {
                    return;
                }
                if (Data.removeDir(itemData.searchItem.url)) {
                    utools.hideMainWindow();
                    removeScriptsAndFeatures(itemData.searchItem.url);
                    utools.outPlugin();
                }
            },
            placeholder: '要移除的监视目录'
        }
    },
    'setup-clear': {
        mode: 'list',
        args: {
            enter: (action: any, callbackSetList: Function) => {
                document.getElementById('setting')?.remove();
                callbackSetList([new ClearAllDirsListItem('')]);
            },
            search: (action: any, searchWord: string, callbackSetList: Function) => {
                callbackSetList([new ClearAllDirsListItem(searchWord)]);
            },
            select: (action: any, itemData: ClearAllDirsListItem, callbackSetList: Function) => {
                if (itemData.confirmed) {
                    utools.hideMainWindow();
                    Data.clearDirs();
                    removeAllScriptsAndFeatures();
                    utools.outPlugin();
                }
            },
            placeholder: 'Confirm Clear'
        }
    },
    'setup-refresh-scripts': {
        mode: 'list',
        args: {
            enter: (action: any, callbackSetList: Function) => {
                document.getElementById('setting')?.remove();
                callbackSetList([new RefreshScriptsListItem()])
            },
            select: (action: any, itemData: RefreshScriptsListItem, callbackSetList: Function) => {
                utools.hideMainWindow();
                removeAllScriptsAndFeatures();
                searchAndAddAllScriptsAndFeatures().then(() => {
                    utools.outPlugin();
                });
            },
            placeholder: '重新扫描所有监视目录'
        }
    },
    'setup-configurations': {
        mode: 'none',
        args: {
            enter: (action: any, callbackSetList: Function) => {
                console.log(Data.getLocalSettings());
                Data.setLocalSettings(Data.getLocalSettings());
                console.log(Data.getGlobalSettings());
                Data.setGlobalSettings(Data.getGlobalSettings());

                utools.setExpendHeight(480);
                SettingsComponent.DoRender();
            },
            placeholder: '设置'
        }
    },
    'run-script': {
        mode: 'list',
        args: {
            enter: ({ code, type, payload } : { code: string, type: string, payload: string }, callbackSetList: Function) => {
                document.getElementById('setting')?.remove();
                console.log('enter', code, type, payload);
                if (type === 'over') {
                    const searchWords = payload.toLocaleLowerCase().split(' ').filter(x => !!x);
                    callbackSetList(searchAllScriptCommands(searchWords).map(item => new DBScriptListItem(item)));
                    // hack: use async function to do setSubInputValue later
                    sleep(300).then(() => {
                        window.utools.setSubInputValue(payload);
                    });
                } else {
                    callbackSetList(searchAllScriptCommands([]).map(item => new DBScriptListItem(item)));
                }
            },
            search: (action: any, searchWord: string, callbackSetList: Function) => {
                console.log('search', action, searchWord);
                const searchWords = searchWord.toLocaleLowerCase().split(' ').filter(x => !!x);
                callbackSetList(searchAllScriptCommands(searchWords).map(item => new DBScriptListItem(item)));
            },
            select: (action: any, itemData: DBScriptListItem, callbackSetList: Function) => {
                const script = itemData.searchItem.url;
                utools.hideMainWindow();
                runCommand(script);
                utools.outPlugin();
            },
            placeholder: '运行脚本'
        }
    }
}

export { windowExports }

function onMainPushCallback({ code, type, payload } : { code: string, type: string, payload: string }) {
    if (code !== 'run-script' || type !== 'over') {
        return;
    }
    const searchWords = payload.toLocaleLowerCase().split(' ').filter(x => !!x);
    let result = searchAllScriptCommands(searchWords).map(item => new PushScriptListItem(item));
    const total = result.length;
    if (total > 6) {
        result = result.slice(0, 5);
        result.push({
            text: "共搜索到 " + total + " 个脚本，查看更多...",
            icon: '',
            title: "进入应用查看更多",
            searchItem: { url: '', dir: '', idx1: [], subArr1: [], idx2: [], subArr2: [] }
        });
    }
    return result;
}

function onMainPushSelectCallback({ code, type, payload, option } : { code: string, type: string, payload: string, option: PushScriptListItem }) {
    const script = option.searchItem.url;
    if (script === '' || script === undefined) {
        return true;
    }
    utools.hideMainWindow();
    runCommand(script);
    return false;
}

// @ts-ignore
window.utools.onMainPush(onMainPushCallback, onMainPushSelectCallback)