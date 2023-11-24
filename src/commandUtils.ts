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

    const envVars = process.env;
    envVars.PATH = envVars.PATH + Data.getLocalSettings().commonSettings.env;
    const cwd = path.dirname(script);
    console.log('PATH = ' + envVars.PATH);
    
    let command = fileType.command;
    if (command) {
        if (command.indexOf('$FILE') < 0) {
            command = command + ' $FILE';
        }
        command = command.replace(/\$FILE/gi, script);

        console.log('Run: ' + command);
        const proc = child_process.spawn(command, [], {
            detached: true,
            shell: true,
            env: envVars,
            cwd: cwd
        });

        proc.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        proc.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        proc.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    } else {
        if (window.utools.isWindows()) {
            console.log('Open: ' + script);
            electron.shell.openExternal(script);
        } else {
            console.log('Run: ' + script);
            const proc = child_process.spawn(script, {
                detached: true,
                shell: true,
                env: envVars,
                cwd: cwd
            });

            proc.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });
            proc.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });
            proc.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
            });
        }
    }
}

export {
    runCommand
}