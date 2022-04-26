import { Request, Response } from 'express';
import { Session } from '../../../models/Session';
import {
    errorWithStatusAndJson,
    infoWithStatusAndJson,
} from '../../../util/logger';

export default (req: Request, res: Response): void | Response => {
    if (!req.body)
        return errorWithStatusAndJson('Missing parameters', res, 400, {
            success: false,
            message: 'Missing parameters',
        });

    const password = req.body.password || req.query.password;
    const sid = req.body.sid || req.query.sid;

    if (!password || !sid)
        return errorWithStatusAndJson('Missing parameters', res, 400, {
            success: false,
            message: 'Missing parameters',
        });

    Session.findOne({ sid: sid }, (err: any, session: any) => {
        if (err) return res.sendStatus(500);

        if (!session || session.password !== password)
            return errorWithStatusAndJson('Session not found', res, 404, {
                success: false,
                message: 'Session not found',
            });

        return infoWithStatusAndJson(
            `\n    Recieved request to validate session: ${sid}\n    Session is valid\n`,
            res,
            200,
            {
                success: true,
                message: 'Valid session',
            },
        );
    });
};
