import path from 'path';
import child_process from 'child_process';
import electron from 'electron';
const allowExts : Record<string, string> = { '.py': 'python', '.js': 'node', '.sh': '', '.bat': '' };
const envVars = require('process').env;
envVars.PATH = envVars.PATH + ':/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin';

function runCommand(file: string) {
    const ext = path.extname(file);
    const command = allowExts[ext];
    if (command) {
        console.log('Run: ' + command + ' ' + file);
        child_process.spawn(command, [file], {
            detached: true,
            shell: true,
            env: envVars
       });
    } else {
        if (window.utools.isWindows()) {
            console.log('Open: ' + file);
            electron.shell.openExternal(file);
        } else {
            console.log('Run: ' + file);
            child_process.spawn(file, {
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