import { Request, Response } from 'express';

import { Session } from '../../../models/Session';
import {
    infoWithStatusAndJson,
    errorWithStatusAndJson,
} from '../../../util/logger';

const uuid = require('uuid').v4;

export default (req: Request, res: Response): void | Response => {
    if (!req.body)
        return errorWithStatusAndJson('Missing parameters', res, 400, {
            success: false,
            message: 'Missing parameters',
        });

    const { password } = req.body;
    const { url } = req.body;
    const sid = uuid();

    if (!password || !url)
        return errorWithStatusAndJson('Missing parameters', res, 400, {
            success: false,
            message: 'Missing parameters',
        });

    if (!sid)
        return errorWithStatusAndJson('Invalid sid', res, 500, {
            success: false,
            message: 'Invalid sid',
        });

    new Session({
        sid: sid,
        password: password,
        url: url,
        users_connected: [],
    }).save((err: any): void | Response => {
        if (err)
            return res
                .status(409)
                .json({ success: false, message: 'Already exists' });

        const message = `Created session { sid: "${sid}", password: "${password}", url: "${url}" }`;

        infoWithStatusAndJson(message, res, 201, {
            success: true,
            message: 'Created',
            sid: sid,
        });
    });
};
