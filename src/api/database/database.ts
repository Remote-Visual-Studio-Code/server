/* eslint-disable import/order */
import logger = require('../../util/logger');
import { Application } from 'express';
import mongoose from 'mongoose';

export = {
    connect: async (app: Application): Promise<void> => {
        logger.info('Attempting to connect to database');

        // @ts-ignore
        const URI: string = process.env.DATABASE_URI;

        try {
            await mongoose.connect(URI);
        } catch (err: Error) {
            return logger.errorThrow(`Failed to connect to database`, err);
        }

        const port = process.env.PORT || 8000;

        app.listen(port, () => {
            logger.info(
                `Remote Visual Studio Code server running on port ${port}`,
                'RVSC',
            );
        });
    },
};
