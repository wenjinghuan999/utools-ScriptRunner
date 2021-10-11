import path from 'path';

function getBasename(url: string): string {
    let basename = path.basename(url);
    if (!basename && window.utools.isWindows()) {
        basename = url;
    }
    return url;
}

export {
    getBasename
}