import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

import { info } from '../util/logger';
import walk from '../util/walk';

const router = express.Router();

walk(path.join(__dirname, 'routes'), (err: any, results: string[]) => {
    if (err) throw err;

    results.forEach((file: string) => {
        const object: { obj?: any; name?: string } = {};

        object.obj = require(file).default;
        object.name = file
            .split('api\\routes\\')[1]
            .replace(/\\/g, '/')
            .replace('.js', '');

        const objectRouter = express.Router();
        objectRouter.get('/', (req, res) => {
            object.obj(req, res);
        });

        const route = `/${object.name.replace('\\', '/')}`;

        router.use(route, objectRouter);
        info(`Added route ${route}`);
    });
});

walk('./out/src/web', (err: any, results: any[]) => {
    if (err) throw err;

    results.forEach((file: fs.PathOrFileDescriptor) => {
        if (typeof file !== 'string') return;

        const name = file.split('\\')[file.split('\\').length - 1];

        if (name.endsWith('.js')) {
            const text = fs.readFileSync(file, 'utf8');

            const r = express.Router();
            r.get('/', (_req: Request, res: Response) => {
                res.send(text);
            });

            const route = `/bundle/${name.replace('.js', '')}`;

            router.use(route, r);
            info(`Added bundle ${route}`);
        }
    });
});

export default router;
