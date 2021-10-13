const stylus = require('stylus')
const path = require('path')
const fs = require('fs')
const sourcePath = path.join('src', 'styles', 'src')
const targetPath = path.join('src', 'styles')

fs.readdirSync(sourcePath).forEach(file => {
    const fullFile = path.join(sourcePath, file);
    if (fs.statSync(fullFile).isFile) {
        if (['.css', '.styl'].includes(path.extname(file))) {
            const fullTarget = path.join(targetPath, file.split('.')[0] + '.ts');
            console.log('Rendering ' + file);
            console.log(fullFile + ' => ' + fullTarget);
            const fileContent = fs.readFileSync(fullFile, {encoding: 'utf-8'}).replaceAll('`', '\\`');
            if (path.extname(file) == '.styl') {
                stylus.render(fileContent, (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        fs.writeFileSync(fullTarget, `// language=CSS
export const Css: string = \`
${result.replaceAll(/\n/g, '').trim()}
\``
                            , {encoding: 'utf8', flag: 'w+'});
                    }
                })
            } else {
                const result = fileContent;
                fs.writeFileSync(fullTarget, `// language=CSS
export const Css: string = \`
${result.replaceAll(/\n/g, '').trim()}
\``
                    , {encoding: 'utf8', flag: 'w+'});
            }
        }
    }
});
