import path from 'path';
import child_process from 'child_process';
import electron from 'electron';
import process from 'process';
import { Data } from './dataUtils';

function runCommand(script: string) {
    const fileType = Data.findFileType(script);
    if (!fileType) {
        return;
    }
    console.log('Found file type:')
    console.log(fileType);

    const command = fileType.command;
    const envVars = process.env;
    envVars.PATH = envVars.PATH + Data.getLocalSettings().commonSettings.env;

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