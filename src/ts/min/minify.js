/* eslint-disable*/ 'use strict';
const minifier = require('uglify-js');
const fs = require('fs');
const log = {};
const names = [];
function getCommentedText() {
    return `/*\n    This file was created by the Remote Visual Studio Code team\n    You may NOT distribute or modify any files that belong to the Remote Visual Studio Code team\n\n    © ${new Date().getFullYear()} by Remote Visaul Studio Code\n*/\n`;
}
function makeName() {
    const name =
        '_' +
        Math.random()
            .toString(36)
            .substr(2, 9);
    if (names.includes(name)) return makeName();
    names.push(name);
    return name;
}
function getHtmlTemplate(files) {
    let scripts = '';
    for (const file of files)
        scripts += `    <script src="${file}"></script>\n`;
    return `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta http-equiv="X-UA-Compatible" content="IE=edge">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n    <h1>Hello World</h1>\n\n${scripts}</body>\n</html>`;
}
fs.readdir('./out/min', (err, files) => {
    files.forEach(file => {
        fs.unlink(`./out/min/${file}`, err => {
            if (err) throw err;
        });
    });
});
fs.readdirSync('./out').forEach(file => {
    if (!file.endsWith('.js')) return;
    const name = makeName();
    fs.renameSync(`./out/${file}`, `./out/min/${name}.js`);
    const code = fs.readFileSync(`./out/min/${name}.js`, 'utf8');
    const minified = minifier.minify(code, { mangle: false });
    if (minified.error) return;
    fs.writeFileSync(
        `./out/min/${name}.js`,
        getCommentedText() + minified.code,
    );
    log[file] = `${name}.js`;
    fs.writeFileSync('./out/min/log.json', JSON.stringify(log, null, 4));
    fs.writeFileSync(
        './out/min/index.html',
        getHtmlTemplate(Object.values(log)),
    );
});
