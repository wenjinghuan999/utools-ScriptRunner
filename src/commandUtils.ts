import path from 'path';
import child_process from 'child_process';
import electron from 'electron';
import process from 'process';
import { Data } from './dataUtils';
import { FileTypeSettingItem, Settings } from './settings';

function findFileType(script: string, settings: Settings): FileTypeSettingItem | null {
    for (const id in settings.fileTypes) {
        const fileType = settings.fileTypes[id];
        if (script.match(fileType.pattern)) {
            return fileType;
        }
    }
    return null;
}

function runCommand(script: string) {
    const settings = Data.getSettings();
    const fileType = findFileType(script, settings);
    if (!fileType) {
        return;
    }
    console.log('Found file type:')
    console.log(fileType);

    const command = fileType.command;
    const envVars = process.env;
    envVars.PATH = envVars.PATH + settings.globalSettings.env;

    if (command) {
        console.log('Run: ' + command + ' ' + script);
        child_process.spawn(command, [script], {
            detached: true,
            shell: true,
            env: envVars
       });
    } else {
        if (window.utools.isWindows()) {
            console.log('Open: ' + script);
            electron.shell.openExternal(script);
        } else {
            console.log('Run: ' + script);
            child_process.spawn(script, {
                detached: true,
                shell: true,
                env: envVars
            });
        }
    }
}

export {
    runCommand
}