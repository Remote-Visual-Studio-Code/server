import mongoose from 'mongoose';

import logger from '../util/logger';

export async function connect(): Promise<boolean> {
    const uri: string | undefined = process.env.MONGO_URI;

    if (!uri) throw new Error('MONGO_URI is not defined');

    try {
        await mongoose.connect(uri);

        return true;
    } catch (err) {
        logger.error(`Could not connect to database: ${err}`);

        return false;
    }
}
