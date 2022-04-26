import { Request, Response } from 'express';

import { Session } from '../../../models/Session';
import {
    errorWithStatusAndJson,
    infoWithStatusAndJson,
} from '../../../util/logger';

export default (req: Request, res: Response): void | Response => {
    if (!req.body && !req.query)
        return errorWithStatusAndJson('Missing parameters', res, 400, {
            success: false,
            message: 'Missing parameters',
            url: null,
        });

    const password = req.body.password || req.query.password;
    const sid = req.body.sid || req.query.sid;

    if (!password || !sid)
        return errorWithStatusAndJson('Missing parameters', res, 400, {
            success: false,
            message: 'Missing parameters',
            url: null,
        });

    Session.findOne({ sid: sid }, (err: any, session: any) => {
        if (err)
            return errorWithStatusAndJson('Error', res, 500, {
                success: false,
                message: 'Error',
                url: null,
            });

        if (!session)
            return errorWithStatusAndJson('Session not found', res, 404, {
                success: false,
                message: 'Session not found',
                url: null,
            });

        if (session.password !== password)
            return errorWithStatusAndJson('Session not found', res, 404, {
                success: false,
                message: 'Session not found',
                url: null,
            });

        return infoWithStatusAndJson(`Grabbed URL ${session.url}`, res, 200, {
            success: true,
            url: session.url,
        });
    });
};
