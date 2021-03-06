import { Request, Response } from 'express';
import { Session } from '../../../models/Session';
import {
    errorWithStatusAndJson,
    infoWithStatusAndJson,
} from '../../../util/logger';

export default async (req: Request, res: Response): Promise<any> => {
    if (!req.body) {
        return errorWithStatusAndJson('Missing parameters', res, 400, {
            success: false,
            message: 'Missing parameters',
        });
    }

    const { password } = req.body;
    const { sid } = req.body;

    if (!password || !sid) {
        errorWithStatusAndJson('Missing parameters', res, 400, {
            success: false,
            message: 'Missing parameters',
        });

        return;
    }

    const session = await Session.findOne({ sid: sid });

    if (!session || session.password !== password) {
        errorWithStatusAndJson('No session found', res, 404, {
            success: false,
            message: 'No session found',
        });

        return;
    }

    Session.findOneAndDelete({ sid: sid }, (err: any) => {
        if (err) return res.sendStatus(500);

        return infoWithStatusAndJson('Session deleted', res, 200, {
            success: true,
            message: 'Session deleted',
            sid: sid,
        });
    });
};
