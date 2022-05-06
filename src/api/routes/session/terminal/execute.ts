import * as express from 'express';
import axios from 'axios';

import { Session } from '../../../../models/Session';
import * as logger from '../../../../util/logger';

export default async (
    req: express.Request,
    res: express.Response,
): Promise<express.Response<any, Record<string, any>>> => {
    if (!req.body)
        return logger.errorWithStatusAndJson('Missing parameters', res, 400, {
            success: false,
            message: 'Missing parameters',
            out: null,
        });

    const { sid, password, command } = req.body;
    const { user, location } = req.body.auth;

    if (!sid || !password || !command || !user || !location)
        return logger.errorWithStatusAndJson('Missing parameters', res, 400, {
            success: false,
            message: 'Missing parameters',
            out: null,
        });

    const session = await Session.findOne({ sid: sid, password: password });

    if (!session)
        return logger.errorWithStatusAndJson('No session found', res, 404, {
            success: false,
            message: 'No session found',
            out: null,
        });

    let valid = false;

    session.users_connected.forEach(
        (userConnected: {
            name: string;
            location: string;
            permission: string;
        }) => {
            if (
                userConnected.name === user &&
                userConnected.location === location &&
                userConnected.permission === 'admin'
            )
                valid = true;
        },
    );

    if (!valid)
        return logger.errorWithStatusAndJson('No permission', res, 403, {
            success: false,
            message: 'No permission',
            out: null,
        });

    const { data } = await axios.post(`${session.url}/terminal`, {
        command: command,
    });

    if (!data.success)
        return logger.errorWithStatusAndJson('Error', res, 500, {
            success: false,
            message: data.message,
            out: data.out,
        });

    return logger.infoWithStatusAndJson('Success', res, 200, {
        success: true,
        message: 'Success',
        out: data.out,
    });
};
