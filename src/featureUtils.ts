import path from 'path';
import { runCommand } from './commandUtils';
import { Data } from './dataUtils';
import { searchScripts } from './fsUtils';

function addScriptFeature(dir: string, script: string) {
    console.log("add scripts for dir: " + dir);
    console.log(" - " + script);
    
    const filename = path.basename(script);
    window.exports[script] = {
        mode: "none",
        args: {
            enter: (action: any) => {
                window.utools.hideMainWindow();
                runCommand(script);
                window.utools.outPlugin();
            }
        }
    };
    window.utools.removeFeature(script);
    window.utools.setFeature({
        code: script,
        explain: script + "（位于监视目录：" + dir + "）",
        platform: ['darwin', 'win32'],
        // @ts-ignore
        cmds: [filename, script]
    });
}

async function searchAndAddScriptsAndFeatures(dir: string) {
    const scripts = await searchScripts(dir);
    scripts.forEach(script => {
        addScriptFeature(dir, script);
    });
    Data.addScripts(dir, scripts);
}

async function searchAndAddAllScriptsAndFeatures() {
    const dirs = Data.getAllDirs();
    const allScripts = await Promise.all(dirs.map(dir => searchScripts(dir)));
    dirs.forEach((dir, idx) => {
        const scripts = allScripts[idx];
        scripts.forEach(script => {
            addScriptFeature(dir, script);
        });
        Data.addScripts(dir, scripts);
    });
}

function maybeRemoveScriptFeature(dir: string, script: string) {
    const allScripts = Data.getAllScripts();
    for (const dir_ in allScripts) {
        if (dir_ !== dir && allScripts[dir_].includes(script)) {
            console.log("Should not remove script " + script + " because it is in dir " + dir_);
            const filename = path.basename(script)

            window.utools.removeFeature(script);
            window.utools.setFeature({
                code: script,
                explain: script + "（位于监视目录：" + dir_ + "）",
                platform: ['darwin', 'win32'],
                // @ts-ignore
                cmds: [filename, script]
            });
            return false;
        }
    }
    console.log("Removed: " + script);
    window.utools.removeFeature(script);
    return true;
}

function removeScriptsAndFeatures(dir: string) {
    const scripts = Data.getScripts(dir);
    scripts.forEach(script => {
        console.log('Removing: ' + script);
        maybeRemoveScriptFeature(dir, script);
    });
    Data.removeScripts(dir);
}
 
function removeAllScriptsAndFeatures() {
    const allScripts = Data.getAllScripts();
    for (const dir in allScripts) {
        removeScriptsAndFeatures(dir);
    }
    Data.removeAllScripts();
 }

export {
    searchAndAddScriptsAndFeatures,
    searchAndAddAllScriptsAndFeatures,
    removeScriptsAndFeatures,
    removeAllScriptsAndFeatures
}