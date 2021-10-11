import path from 'path';
import { Data } from './dataUtils';
import { SearchDBScriptItem } from './types';

function searchAllWordsInFilename(file: string, searchWords: string[]): [number[], number[]] {
    const resultIdx: number[] = [];         // positions of each searchWord
    const subarrayLengths: number[] = [];   // lengths of each increasing subarray
    let startPos = 0;
    let subarrayLength = 0;
    for (const i in searchWords) {
        const word = searchWords[i];
        const pos = file.indexOf(word, startPos);
        if (pos >= 0) {
            resultIdx.push(pos);
            startPos = pos;
            subarrayLength += 1;
        } else {
            subarrayLengths.push(subarrayLength);
            subarrayLength = 0;
            if (startPos === 0) {
                resultIdx.push(-1);
            } else {
                startPos = 0;
                resultIdx.push(file.indexOf(word));
            }
        }
    }
    return [resultIdx, subarrayLengths];
}
 
function searchAllWords(script: string, searchWords: string[]) {
    const filename = path.basename(script);
    const [idx1, subArr1] = searchAllWordsInFilename(filename, searchWords);
    const [idx2, subArr2] = searchAllWordsInFilename(script, searchWords);
    return [idx1, subArr1, idx2, subArr2];
}
 
function searchAllScriptCommands(searchWords: string[]) {
    const allScripts = Data.getAllScripts();

    const results: SearchDBScriptItem[] = [];
    for (const dir in allScripts) {
        allScripts[dir].forEach(script => {
            if (results.findIndex(x => x.url === script) >= 0) {
                return;
            }
            if (!searchWords || searchWords.length == 0) {
                results.push({
                    url: script,
                    dir: dir,
                    idx1: [],
                    subArr1: [],
                    idx2: [],
                    subArr2: []
                });
            } else {
                const [idx1, subArr1, idx2, subArr2] = searchAllWords(script.toLocaleLowerCase(), searchWords)
                if (!idx2.includes(-1)) { // if all searchWords appears in script url
                    results.push({
                        url: script,
                        dir: dir,
                        idx1: idx1,
                        subArr1: subArr1,
                        idx2: idx2,
                        subArr2: subArr2
                    });
                }
            }
        });
    }
 
    results.sort((a, b) => {
        // 1. number of searchWords that appears in filename
        if (a.idx1.includes(-1) != b.idx1.includes(-1)) {
            return a.idx1.indexOf(-1) - b.idx1.indexOf(-1);
        }
        // 2. length of increasing subarray in filename
        for (let i = 0; i < a.subArr1.length; i++) {
            if (a.subArr1[i] != b.subArr1[i]) {
                return b.subArr1[i] - a.subArr1[i];
            }
        }
        // 3. position of searchWords in filename
        for (let i = 0; i < a.idx1.length; i++) {
            if (a.idx1[i] != b.idx1[i]) {
                return a.idx1[i] - b.idx1[i];
            }
        }
        // 4. length of increasing subarray in url
        for (let i = 0; i < a.subArr2.length; i++) {
            if (a.subArr2[i] != b.subArr2[i]) {
                return b.subArr2[i] - a.subArr2[i];
            }
        }
        // 5. position of searchWords in url
        for (let i = 0; i < a.idx2.length; i++) {
            if (a.idx2[i] != b.idx2[i]) {
                return a.idx2[i] - b.idx2[i];
            }
        }
        // 6. lexicographical order of filename
        return path.basename(a.url).localeCompare(path.basename(b.url));
    });

    return results;
}
 
export {
    searchAllScriptCommands
}