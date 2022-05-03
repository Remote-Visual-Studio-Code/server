/* eslint-disable no-new-func */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { Application, Request, Response } from 'express';
import fs from 'fs';

import bundle from '../util/bundle';
import walk from '../util/walk';

import * as logger from '../util/logger';

const env = process.env.NODE_ENV || 'development';
const url =
    env === 'development' ? `http://localhost:${process.env.PORT}` : process.env.PROD_URL;

type Meta = {
    name: string;
    title: string;
    route: { override: boolean; route?: string; method?: string };
    dependencies: string[];
    imports: { css: string[]; js: string[]; custom_js: string[] };
    meta: { name: string; content: string }[];
    header: string;
    callback: string;
};

export function compile(
    app: Application,
    path: string,
    ejs: string,
    meta: Meta,
): void {
    // check if ./out/src/pages/out exists
    if (!fs.existsSync('./out/src/pages/out'))
        fs.mkdirSync('./out/src/pages/out/');

    const ejsParts = ejs.split('\n');
    let newEjs = '';

    for (let i = 0; i < ejsParts.length; i += 1) {
        const part = ejsParts[i];

        newEjs += `    ${part}\n`;
    }

    const template = `<!DOCTYPE html>\n<html>\n<head>||#PAGE_HEADER#||</head>\n<body>\n||#PAGE_BODY#||</body>\n</html>`;

    const { title, dependencies, imports } = meta;

    let dependencyString = '';

    for (let i = 0; i < dependencies.length; i += 1) {
        const dep = `${meta.dependencies[i]}.js`;

        const str = bundle.get(dep);

        if (!str) throw new Error(`Dependency ${dep} not found`);

        dependencyString += `    <script src="${url}/api/bundle/${
            str.split('.')[0]
        }"></script>\n`;
    }

    for (let i = 0; i < imports.js.length; i += 1) {
        const js = imports.js[i];

        dependencyString += `    <script src="${js}"></script>\n`;
    }

    let cssString = '';

    for (let i = 0; i < imports.css.length; i += 1) {
        const css = imports.css[i];

        cssString += `    <link rel="stylesheet" href="${css}">\n`;
    }

    const metaString = meta.meta
        .map(
            (m): string => `    <meta name="${m.name}" content="${m.content}">`,
        )
        .join('\n');

    const customJs = meta.imports.custom_js;

    let customJsString = '';

    for (let i = 0; i < customJs.length; i += 1) {
        const js = customJs[i];

        customJsString += `    <script>\n${js}\n</script>\n`;
    }

    const header = `\n    ${meta.header}\n${metaString}\n\n${cssString}\n${dependencyString}\n${customJsString}\n    <title>${title}</title>\n`;

    const page = template
        .replace('||#PAGE_HEADER#||', `${header}`)
        .replace('||#PAGE_BODY#||', newEjs);

    let route = path;
    let method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' = 'GET';

    if (meta.route.override) {
        if (!meta.route.route) throw new Error('Route not found');
        route = meta.route.route; // eslint-disable-line prefer-destructuring

        if (meta.route.method) {
            if (
                method !== 'GET' &&
                method !== 'POST' &&
                method !== 'DELETE' &&
                method !== 'PUT' &&
                method !== 'PATCH'
            ) {
                throw new Error(`Method ${method} not found`);
            }

            // @ts-ignore
            method = meta.route.method; // eslint-disable-line prefer-destructuring
        }
    } else {
        // @ts-ignore
        route = `/${
            route
                .split('/')
                .pop()
                ?.split('.')[0]
        }`;
    }

    path = path.replace(/^\.\/src\/pages\/pages\//, ''); // eslint-disable-line no-param-reassign

    fs.writeFileSync(`./out/src/pages/out${path}`, page);

    const run = (req: Request, res: Response): void => {
        const callback = new Function(
            'req',
            'res',
            'logger',
            `${meta.callback}`,
        );

        callback(req, res, logger);

        if (path.charAt(0) === '/') path = path.substring(1);

        res.render(`${path}`);
    };

    switch (method) {
        case 'GET':
            app.get(route, (req: Request, res: Response) => {
                run(req, res);
            });
            break;
        case 'POST':
            app.post(route, (req: Request, res: Response) => {
                run(req, res);
            });
            break;
        case 'DELETE':
            app.delete(route, (req: Request, res: Response) => {
                run(req, res);
            });
            break;
        case 'PUT':
            app.put(route, (req: Request, res: Response) => {
                run(req, res);
            });
            break;
        case 'PATCH':
            app.patch(route, (req: Request, res: Response) => {
                run(req, res);
            });
            break;
        default:
            throw new Error(`Method ${method} not found`);
    }
}

const metaFolder = './src/pages/data/';
const ejsFolder = './src/pages/pages/';

function getMetadataFromPage(page: string): Meta {
    const content = fs.readFileSync(`${metaFolder}${page}.json`, 'utf8');

    const meta = JSON.parse(content);

    return meta;
}

export default function compilePages(app: Application): void {
    walk(ejsFolder, (error: Error, files: string[]): void => {
        if (error) throw error;

        for (let i = 0; i < files.length; i += 1) {
            const file = files[i].split('pages')[2].replace(/\\/g, '/');

            const path = `${ejsFolder}${file}`;
            const meta = getMetadataFromPage(file);

            const content = fs.readFileSync(path, 'utf8');

            compile(app, path, content, meta);
        }
    });
}
