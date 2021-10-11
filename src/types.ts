export interface SearchDiskDirItem {
    url: string;
    accurate: boolean;
};

export interface SearchDBDirItem {
    url: string;
    basename: string;
    searchWordIdx: number;
    fake: boolean;
};

export interface SearchDBScriptItem {
    url: string;
    dir: string;
    idx1: number[];
    subArr1: number[];
    idx2: number[];
    subArr2: number[];
};
