import path from 'path';

function getBasename(url: string): string {
    let basename = path.basename(url);
    if (!basename && window.utools.isWindows()) {
        basename = url;
    }
    return url;
}

async function sleep(milliseconds: number): Promise<void> {
    await new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
}

export {
    getBasename,
    sleep
}