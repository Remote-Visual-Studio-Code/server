/* eslint-disable consistent-return, no-param-reassign, no-plusplus */
import path from 'path';
import fs from 'fs';

export default function walk(dir: string, done: any): void {
    let results: string[] = [];
    fs.readdir(dir, (err, list) => {
        if (err) return done(err);

        let pending = list.length;

        if (!pending) done(null, results);
        list.forEach(file => {
            file = path.resolve(dir, file);

            fs.stat(file, (_err, stat) => {
                if (stat && stat.isDirectory()) {
                    walk(file, (_err: any, res: string[]) => {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
}
