var fs = require("fs");
var path = require('path');
var execSync = require('child_process').execSync;
const allowExts = ['.py']

function existDir(dirPathName) {
   try {
      var stat = fs.statSync(dirPathName);
      if (stat.isDirectory()) {
         return true;
      } else {
         return false;
      }
   } catch (error) {
      return false;
   }
}

function toStandardPath(url) {
   url = path.resolve(url)
   url = fs.realpathSync.native(url)
   if (url != "/" && url != "\\" && existDir(url)) {
      url = url + path.sep
   }
   if (window.utools.isWindows()) {
      const pos = url.indexOf(':')
      if (pos > 0) {
         url = url.substr(0, pos).toLocaleUpperCase() + url.substr(pos)
      }
   }
   return url;
}

function convertToRealpath(searchWord) {
   var url = utools.getCurrentFolderPath()
   if (typeof url === 'string' && url) {
      url = url + path.sep
   }
   else {
      url = ""
   }
   return url + searchWord;
}

function convertFromRealpath(realUrl) {
   var url = utools.getCurrentFolderPath()
   if (typeof url === 'string' && url) {
      return path.relative(url, fs.realpathSync.native(realUrl)) + path.sep;
   }
   else {
      return fs.realpathSync.native(realUrl) + path.sep;
   }
}

function getBasename(url) {
   var basename = path.basename(url)
   if (!basename && window.utools.isWindows()) {
      basename = url
   }
   return url;
}

function searchDiskRoots(searchWord) {
   items = [];
   const lowerSearchWord = searchWord.toLocaleLowerCase()
   if (window.utools.isWindows()) {
      stdout = execSync('wmic logicaldisk get caption', { encoding: 'ascii' })
      var outStrArray = stdout.split("\n")
      for (i = 1; i < outStrArray.length; i++) {
         if (outStrArray[i].trim().length > 1) {
            const url = outStrArray[i].trim()
            if (searchWord && url.toLocaleLowerCase().indexOf(lowerSearchWord) < 0) {
               continue
            }
            items.push({
               title: url,
               description: url + path.sep,
               icon: window.utools.getFileIcon(url),
               url: url,
               blur: true
            });
         }
      }
   }
   return items;
}

function searchPathOnDisk(url) {
   console.log("searchPathOnDisk: " + url)
   if (!url) {
      if (window.utools.isWindows()) {
         return searchDiskRoots("")
      }
      else {
         url = "/"
      }
   }
   var pos = url.lastIndexOf('\\')
   const pos2 = url.lastIndexOf('/')
   pos = pos < pos2 ? pos2 : pos;
   var parent = ""
   var searchWord = url
   if (pos >= 0) {
      parent = url.substr(0, pos)
      if (parent == "") {
         parent = window.utools.isWindows() ? parent : '/'
      }
      searchWord = url.substr(pos + 1)
      if (!existDir(parent)) {
         return [];
      }
   }
   parent = parent && parent != '/' ? parent + path.sep : parent;
   console.log(parent)
   console.log(searchWord)
   var results = []
   if (!searchWord && parent != '/') {
      const standardParent = toStandardPath(parent)
      results.push({
         title: "添加选定目录：" + getBasename(parent),
         description: standardParent,
         icon: utools.getFileIcon(standardParent),
         url: standardParent,
         blur: false
      })
   }
   else if (!parent) {
      return searchDiskRoots(searchWord)
   }
   const lowerSearchWord = searchWord.toLocaleLowerCase()
   fs.readdirSync(parent).forEach(function (file) {
      url = parent + file
      const standardUrl = toStandardPath(url)
      if (existDir(url) && file.toLocaleLowerCase().startsWith(lowerSearchWord)) {
         results.push({
            title: file,
            description: standardUrl,
            icon: window.utools.getFileIcon(standardUrl),
            url: standardUrl,
            blur: file != searchWord
         })
      }
   })
   return results;
}

function addDirToDB(url) {
   const id = 'dirs'
   var dirs = window.utools.db.get(id)
   if (!dirs) {
      dirs = { 
         _id: id,
         data: [],
      }
   }
   if (dirs.data.indexOf(url) < 0) {
      dirs.data.push(url)
   }
   window.utools.db.put(dirs)
   return true;
}

function getDirsFromDB() {
   const id = 'dirs'
   var dirs = window.utools.db.get(id)
   if (!dirs) {
      return [];
   }
   return dirs.data;
}

function searchDirsFromDB(searchWord) {
   results = []
   const lowerSearchWord = searchWord.toLocaleLowerCase()
   getDirsFromDB().forEach((url, index, array) => {
      var lowerUrl = url.toLocaleLowerCase()
      var pos = searchWord ? lowerUrl.indexOf(lowerSearchWord) : 0
      if (pos >= 0) {
         const basename = getBasename(url)
         const posBase = searchWord ? basename.toLocaleLowerCase().indexOf(lowerSearchWord) : 0
         pos = posBase >= 0 ? posBase - 10000 : pos 
         results.push({
            title: basename,
            description: url,
            icon: utools.getFileIcon(url),
            searchWordIdx: pos,
            url: url,
            fake: false
         })
      }
   })
   results.sort((a, b) => {
      return a.searchWordIdx == b.searchWordIdx ? a.title.localeCompare(b.title) : a.searchWordIdx - b.searchWordIdx;
   })
   if (!results || results.length == 0) {
      results.push({
         title: "没有已添加的监视目录",
         description: "使用“脚本运行添加目录”、“Add Folder for ScriptRunner”等关键字添加监视目录",
         fake: true
      })
   }
   return results;
}

function removeDirFromDB(url) {
   const id = 'dirs'
   var dirs = window.utools.db.get(id)
   if (!dirs) {
      return false;
   }
   const idx = dirs.data.indexOf(url)
   if (idx >= 0) {
      dirs.data.splice(idx, 1)
      window.utools.db.put(dirs)
      return true;
   }
   return false;
}

function clearAllDirsFromDB() {
   const id = 'dirs'
   var dirs = window.utools.db.get(id)
   if (!dirs) {
      dirs = { 
         _id: id,
         data: [],
      }
   }
   dirs.data = []
   window.utools.db.put(dirs)
}

function generateListItemForClearAllDirs(searchWord) {
   if (searchWord == "Confirm Clear") {
      return [{
         title: "清空所有监视目录",
         description: "注意：清空操作无法恢复",
         confirmed: true
      }]
   }
   else {
      return [{
         title: "注意：清空操作无法恢复",
         description: "在输入框中输入“Confirm Clear”并按回车，以清空所有监视目录",
         confirmed: false
      }]
   }
}

function searchScripts(url, callbackAddScripts) {
   if (!existDir(url)) {
      return;
   }
   url = path.resolve(url) + path.sep
   process = (err, base, files) => {
      if (err) {
         return;
      }
      subDirs = []
      scripts = []
      files.forEach(file => {
         const fullFile = path.join(base, file)
         if (existDir(fullFile)) {
            subDirs.push(fullFile)
         }
         else if (allowExts.includes(path.extname(fullFile))) {
            scripts.push(fullFile)
         }
      })
      if (scripts.length) {
         callbackAddScripts(url, scripts)
      }
      if (subDirs.length) {
         subDirs.forEach(subDir => {
            fs.readdir(subDir, (err_, files_) => {
               process(err_, subDir, files_)
            })
         })
      }
   }
   fs.readdir(url, (err_, files_) => {
      process(err_, url, files_)
   })
}

function searchAllScripts(callbackAddScripts) {
   getDirsFromDB().forEach(url => {
      searchScripts(url, callbackAddScripts)
   })
}

function addScriptsToDB(url, scripts) {
   const id = 'scripts'
   var data = window.utools.db.get(id)
   if (!data || typeof(data.data) !== "object") {
      data = { 
         _id: id,
         data: {},
      }
   }
   scripts.forEach(file => {
      if ("undefined" === typeof(data.data[url])) {
         data.data[url] = [file]
      }
      else if (data.data[url].indexOf(file) < 0) {
         data.data[url].push(file)
      }
   })
   window.utools.db.put(data)
}

function getScriptsFromDB(url) {
   const id = 'scripts'
   var data = window.utools.db.get(id)
   if (!data || typeof(data.data) !== "object" || !data.data[url]) {
      return [];
   }
   return data.data[url];
}

function addScriptCommands(url, scripts) {
   console.log("add scripts for url: " + url)
   scripts.forEach(file => {
      console.log(" - " + file)
      const code = path.basename(file)
      window.exports[file] = {
         mode: "none",
         args: {
            enter: (action) => {
               window.utools.hideMainWindow()
               require('electron').shell.openExternal(file)
               window.utools.outPlugin()
            }  
         } 
      }
      window.utools.removeFeature(file)
      window.utools.setFeature({
         "code": file,
         "explain": file + "（位于监视目录：" + url + "）",
         "icon": "python.png",
         "cmds": [code, file]
      })
   })
   addScriptsToDB(url, scripts)
}

function maybeRemoveScriptCommand(url, file) {
   const id = 'scripts'
   var data = window.utools.db.get(id)
   if (!data || typeof(data.data) !== "object") {
      window.utools.removeFeature(file)
      return true;
   }
   for (var url_ in data.data) {
      if (url_ !== url && data.data[url_].includes(file)) {
         console.log("Should not remove script " + file + " because it is in url " + url_)
         const code = path.basename(file)
         window.utools.removeFeature(file)
         window.utools.setFeature({
            "code": file,
            "explain": file + "（位于监视目录：" + url_ + "）",
            "icon": "python.png",
            "cmds": [code, file]
         })
         return false;
      }
   }
   window.utools.removeFeature(file)
   return true;
}

function removeScriptCommands(url) {
   getScriptsFromDB(url).forEach(file => {
      maybeRemoveScriptCommand(url, file)
   })
   const id = 'scripts'
   var data = window.utools.db.get(id)
   if (!data || typeof(data.data) !== "object" || !data.data[url]) {
      return;
   }
   delete data.data[url]
   window.utools.db.put(data)
}

function removeAllScriptCommands() {
   const id = 'scripts'
   var data = window.utools.db.get(id)
   if (!data || typeof(data.data) !== "object") {
      return;
   }
   for (var url in data.data) {
      removeScriptCommands(url)
   }
}

function searchAllWordsInFilename(file, searchWords) {
   var resultIdx = []
   var subarrayLengths = []
   var startPos = 0
   var subarrayLength = 0
   for (var i in searchWords) {
      const word = searchWords[i]
      var pos = file.indexOf(word, startPos)
      resultIdx.push(pos)
      if (pos < 0) {
         subarrayLengths.push(subarrayLength)
         if (startPos > 0) {
            startPos = 0
            subarrayLength = -1
            resultIdx.push(file.indexOf(word))
         }
      }
      subarrayLength += 1
   }
   return [resultIdx, subarrayLengths];
}

function searchAllWords(file, searchWords) {
   const basename = path.basename(file)
   var [idx1, subarr1] = searchAllWordsInFilename(basename, searchWords)
   var [idx2, subarr2] = searchAllWordsInFilename(file, searchWords)
   return [idx1, subarr1, idx2, subarr2]
}

function searchAllScriptCommands(searchWords) {
   const id = 'scripts'
   var data = window.utools.db.get(id)
   if (!data || typeof(data.data) !== "object") {
      return;
   }

   var results = []
   for (var url in data.data) {
      data.data[url].forEach(file => {
         if (results.find(x => x.url === file) >= 0) {
            return;
         }
         if (!searchWords || searchWords.length == 0) {
            results.push({
               title: path.basename(file),
               description: file + "（位于监视目录：" + url + "）",
               icon: utools.getFileIcon(file),
               url: file,
               idx1: [],
               subarr1: [],
               idx2: [],
               subarr2: []
            })
         }
         else {
            var [idx1, subarr1, idx2, subarr2] = searchAllWords(file.toLocaleLowerCase(), searchWords)
            if (!idx2.includes(-1)) {
               results.push({
                  title: path.basename(file),
                  description: file + "（位于监视目录：" + url + "）",
                  icon: utools.getFileIcon(file),
                  url: file,
                  idx1: idx1,
                  subarr1: subarr1,
                  idx2: idx2,
                  subarr2: subarr2
               })
            }
         }
      })
   }

   results.sort((a, b) => {
      if (a.idx1.includes(-1) != b.idx1.includes(-1)) {
         return a.idx1.indexOf(-1) - b.idx1.indexOf(-1);
      }
      for (var i = 0; i < a.subarr1.length; i++) {
         if (a.subarr1[i] != b.subarr1[i]) {
            return b.subarr1[i] - a.subarr1[i];
         }
      }
      for (var i = 0; i < a.idx1.length; i++) {
         if (a.idx1[i] != b.idx1[i]) {
            return a.idx1[i] - b.idx1[i];
         }
      }
      for (var i = 0; i < a.subarr2.length; i++) {
         if (a.subarr2[i] != b.subarr2[i]) {
            return b.subarr2[i] - a.subarr2[i];
         }
      }
      for (var i = 0; i < a.idx1.length; i++) {
         if (a.idx1[i] != b.idx1[i]) {
            return a.idx1[i] - b.idx1[i];
         }
      }
      return a.title.localeCompare(b.title);
   })
   return results;
}

window.exports = {
   "setup-add": {
      mode: "list",
      args: {
         enter: (action, callbackSetList) => {
            var url = convertToRealpath("")
            callbackSetList(searchPathOnDisk(url, callbackSetList))
         },
         search: (action, searchWord, callbackSetList) => {
            var url = convertToRealpath(searchWord)
            callbackSetList(searchPathOnDisk(url, callbackSetList))
         },
         select: (action, itemData, callbackSetList) => {
            var url = utools.getCurrentFolderPath()
            if (typeof url === 'string' && url) {
               url = url + path.sep
            }
            else {
               url = ""
            }
            if (itemData.blur) {
               utools.setSubInputValue(convertFromRealpath(itemData.url))
            }
            else if (addDirToDB(itemData.url)) {
               utools.hideMainWindow()
               searchScripts(itemData.url, addScriptCommands)
               utools.outPlugin()
            }
         },
         placeholder: "要添加的监视目录"
      }
   },
   "setup-remove": {
      mode: "list",
      args: {
         enter: (action, callbackSetList) => {
            callbackSetList(searchDirsFromDB(""))
         },
         search: (action, searchWord, callbackSetList) => {
            callbackSetList(searchDirsFromDB(searchWord))
         },
         select: (action, itemData, callbackSetList) => {
            if (itemData.fake) {
               return;
            }
            if (removeDirFromDB(itemData.url)){
               utools.hideMainWindow()
               removeScriptCommands(itemData.url)
               utools.outPlugin()
            }
         },
         placeholder: "要移除的监视目录"
      }
   },
   "setup-clear": {
      mode: "list",
      args: {
         enter: (action, callbackSetList) => {
            callbackSetList(generateListItemForClearAllDirs(""))
         },
         search: (action, searchWord, callbackSetList) => {
            callbackSetList(generateListItemForClearAllDirs(searchWord))
         },
         select: (action, itemData, callbackSetList) => {
            if (itemData.confirmed) {
               utools.hideMainWindow()
               removeAllScriptCommands()
               clearAllDirsFromDB()
               utools.outPlugin()
            }
         },
         placeholder: "Confirm Clear"
      }
   },
   "setup-refresh-scripts": {
      mode: "list",
      args: {
         enter: (action, callbackSetList) => {
            callbackSetList([{title: "重新扫描所有监视目录"}])
         },
         select: (action, itemData, callbackSetList) => {
            utools.hideMainWindow()
            removeAllScriptCommands()
            searchAllScripts((url, scripts) => {
               addScriptCommands(url, scripts)
            })
            utools.outPlugin()
         },
         placeholder: "重新扫描所有监视目录"
      }
   },
   "run-script": {
      mode: "list",
      args: {
         enter: (action, callbackSetList) => {
            callbackSetList(searchAllScriptCommands([]))
         },
         search: (action, searchWord, callbackSetList) => {
            var searchWords = searchWord.toLocaleLowerCase().split(' ').filter(x => !!x)
            callbackSetList(searchAllScriptCommands(searchWords))
         },
         select: (action, itemData, callbackSetList) => {
            const file = itemData.url
            window.utools.hideMainWindow()
            require('electron').shell.openExternal(file)
            window.utools.outPlugin()
         },
         placeholder: "运行脚本"
      }
   }
}