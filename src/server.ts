/* eslint-disable import/no-named-as-default-member, import/no-named-as-default, node/no-missing-require, no-new, import/first */
require('dotenv').config();

import express from 'express';

import ApplicationOptions from './util/ApplicationOptions';
import pages from './pages/pages';

const app = express();

(async (): Promise<void> => {
    new ApplicationOptions(app, {
        url_parsers: {
            url_encoded: true,
            json: true,
        },
        cors_policy: {
            origin: '*',
        },
        view_engine: {
            engine: 'ejs',
            folder: './out/src/pages/out',
        },
        public: {
            folder: './out/src/public',
        },
        routers: [['/api', require('./api/api').default]],
        pages: pages,
    });

    await require('./api/database/database').connect(app);
})();
