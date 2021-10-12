import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { SearchDiskDirItem } from './types';
import { Data } from './dataUtils';

async function existDir(dirPathName: string): Promise<boolean> {
    try {
        return (await fs.promises.stat(dirPathName)).isDirectory();
    } catch (err) {
        return false;
    }
}

async function toStandardPath(url: string): Promise<string> {
    url = path.resolve(url);
    url = await fs.promises.realpath(url);
    if (!url.endsWith("/") && !url.endsWith("\\") && await existDir(url)) {
        url = url + path.sep;
    }
    if (window.utools.isWindows()) {
        const pos = url.indexOf(':');
        if (pos > 0) {
            url = url.substr(0, pos).toLocaleUpperCase() + url.substr(pos);
        }
    }
    return url;
}

async function getCurrentFolderPath(): Promise<string> {
    try {
        const url = await window.utools.readCurrentFolderPath();
        return url ? url + path.sep : '';
    } catch (err) {
        return '';
    }
}

async function convertToRealpath(searchWord: string): Promise<string> {
    return (await getCurrentFolderPath()) + searchWord;
}

async function convertFromRealpath(realUrl: string): Promise<string> {
    try {
        const url = await window.utools.readCurrentFolderPath();
        if (url) {
            return path.relative(url, await fs.promises.realpath(realUrl)) + path.sep;
        } else {
            return (await fs.promises.realpath(realUrl)) + path.sep;
        }
    } catch (err) {
        return (await fs.promises.realpath(realUrl)) + path.sep;
    }
}

async function searchWindowsDiskRoots(searchWord: string): Promise<SearchDiskDirItem[]> {
    console.log('searchWindowsDiskRoots: ' + searchWord);
    if (!window.utools.isWindows()) {
        return [] as SearchDiskDirItem[];
    }
    return new Promise<SearchDiskDirItem[]>(resolve => {
        child_process.exec('wmic logicaldisk get caption', { encoding: 'ascii' }, (err, stdout, stderr) => {
            const items: SearchDiskDirItem[] = [];
            const lowerSearchWord = searchWord.toLocaleLowerCase();
            if (err) {
                return resolve(items);
            }
            const outStrArray = stdout.split('\n');
            for (let i = 1; i < outStrArray.length; i++) {
                if (outStrArray[i].trim().length > 1) {
                    const url = outStrArray[i].trim();
                    if (searchWord && url.toLocaleLowerCase().indexOf(lowerSearchWord) < 0) {
                        continue;
                    }
                    items.push({
                        url: url,
                        accurate: false
                    });
                }
            }
            return resolve(items);
        })
    });
}

async function searchPathOnDisk(url: string): Promise<SearchDiskDirItem[]> {
    console.log('searchPathOnDisk: ' + url);
    if (!url) {
        if (window.utools.isWindows()) {
            return searchWindowsDiskRoots('');
        }
        else {
            url = '/';
        }
    }
    let pos = url.lastIndexOf('\\')
    const pos2 = url.lastIndexOf('/')
    pos = pos < pos2 ? pos2 : pos;
    let parent = '';
    let searchWord = url;
    if (pos >= 0) {
        parent = url.substr(0, pos);
        if (parent === '') {
            parent = window.utools.isWindows() ? parent : '/';
        }
        searchWord = url.substr(pos + 1);
    }

    const result: SearchDiskDirItem[] = [];
    if (pos < 0) {
        console.log('Parent does not exist: ' + parent);
        return result;
    }

    const parentWithSuffix = parent && parent != '/' ? parent + path.sep : parent;
    const searchInWindowsRoot = !searchWord && !parentWithSuffix;
    if (searchInWindowsRoot) {
        return searchWindowsDiskRoots('');
    }
    if (!searchWord) {
        result.push({
            url: await toStandardPath(parentWithSuffix),
            accurate: true
        });
    }

    const lowerSearchWord = searchWord.toLocaleLowerCase();
    const files = await fs.promises.readdir(parentWithSuffix);
    const itemsToAdd = await Promise.all(files.map(async (file): Promise<SearchDiskDirItem | null> => {
        if (file === "System Volume Information") {
            return null;
        }
        const dir = parentWithSuffix + file;
        if (file.toLocaleLowerCase().startsWith(lowerSearchWord) && (await existDir(dir))) {
            return {
                url: await toStandardPath(dir),
                accurate: false
            };
        }
        return null;
    }));
    itemsToAdd.forEach(item => {
        if (item !== null) {
            result.push(item);
        }
    })
    return result;
}

async function searchScripts(url: string): Promise<string[]> {
    if (!existDir(url)) {
       return [];
    }
    url = path.resolve(url) + path.sep;
    const allowPatterns = Data.getAllowPatterns();
    console.log('Patterns:');
    console.log(allowPatterns);

    const process = async (base: string, files: string[]): Promise<string[]> => {
        const fullFiles = files.map(file => path.join(base, file));
        const isDirs = await Promise.all(fullFiles.map(fullFile => existDir(fullFile)));
        const scripts: string[] = [];
        const subDirs: string[] = [];
        isDirs.forEach((isDir, idx) => {
            const fullFile = fullFiles[idx];
            const filename = files[idx];
            if (isDir) {
                subDirs.push(fullFile);
            } else {
                for (const pattern of allowPatterns) {
                    if (filename.match(pattern)) {
                        scripts.push(fullFile);
                        break;
                    }
                }
            }
        })

        const subDirResults = await Promise.all(subDirs.map(async subDir => {
            try {
                return process(subDir, await fs.promises.readdir(subDir));
            } catch (err) {
                return [];
            }
        }));

        let result = scripts;
        subDirResults.forEach(subDirResult => {
            result = result.concat(subDirResult);
        })
        return result;
    };

    try {
        return process(url, await fs.promises.readdir(url));
    } catch (err) {
        return [];
    }
}

export {
    existDir, 
    toStandardPath, 
    getCurrentFolderPath, 
    convertToRealpath, 
    convertFromRealpath, 
    searchWindowsDiskRoots, 
    searchPathOnDisk,
    searchScripts
};
