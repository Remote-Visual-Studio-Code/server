/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { Request, Response } from 'express';
import { Session } from '../../../../models/Session';
import {
    errorWithStatusAndJson,
    info,
    infoWithStatusAndJson,
} from '../../../../util/logger';

const cities = require('cities.json'); // eslint-disable-line @typescript-eslint/no-var-requires

const axios = require('axios').default;

export default async (
    req: Request,
    res: Response,
): Promise<void | Response<any, Record<string, any>>> => {
    if (!req.body || !req.body.info)
        return errorWithStatusAndJson('Missing parameters', res, 400, {
            success: false,
            message: 'Missing parameters',
        });

    const { permissionRequested } = req.body.info;
    const { location } = req.body.info;
    const { name } = req.body.info;

    const { password } = req.body;
    const { sid } = req.body;

    if (!permissionRequested || !location || !name || !password || !sid)
        return errorWithStatusAndJson('Missing parameters', res, 400, {
            success: false,
            message: 'Missing parameters',
        });

    switch (permissionRequested) {
        case 'admin':
            break;
        case 'editor':
            break;
        case 'viewer':
            break;
        default:
            return errorWithStatusAndJson('Invalid permission', res, 400, {
                success: false,
                message: 'Invalid permission',
            });
    }

    const city = cities.find(
        (c: { name: string; country: string }) =>
            c.name === location.split(' - ')[0] &&
            c.country === location.split(' - ')[1],
    );

    if (!city)
        return errorWithStatusAndJson('Invalid location', res, 400, {
            success: false,
            message: 'Invalid location',
        });

    Session.findOne(
        { sid: sid },
        async (
            err: any,
            session: any,
        ): Promise<void | Response<any, Record<string, any>>> => {
            if (err)
                return res.status(500).json({ success: false, message: err });

            if (!session || session.password !== password)
                return res
                    .status(404)
                    .json({ success: false, message: 'Session not found' });

            const url = encodeURI(
                `${session.url}/auth/connect?name=${name}&location=${location}&permissionRequested=${permissionRequested}`,
            );

            let response = null;
            info(`Sending request to ${url}`);

            try {
                response = await axios.get(url);
            } catch (err) {
                // @ts-ignore
                if (!err.response || !err.response.data)
                    return infoWithStatusAndJson('Invalid response', res, 500, {
                        success: false,
                        message: 'Invalid response',
                    });

                // @ts-ignore
                if (err.response.data.message === 'Timed out')
                    return infoWithStatusAndJson('Timed out', res, 200, {
                        success: true,
                        message: 'Timed out',
                        accepted: false,
                        permission: null,
                    });

                errorWithStatusAndJson('Could not connect', res, 500, {
                    success: false,
                    message: 'Could not connect',
                });
                return;
            }

            if (response.status !== 201 && response.status !== 200)
                return errorWithStatusAndJson(
                    `Found a non-OK response (${response.status})`,
                    res,
                    500,
                    { success: false, message: response.data },
                );

            const { accepted } = response.data;
            const { permission } = response.data;
            const { files } = response.data;

            if (!accepted)
                return errorWithStatusAndJson(
                    `Request was rejected from session ${sid}`,
                    res,
                    200,
                    { success: true, accepted: accepted, message: 'Success' },
                );

            Session.findOneAndUpdate(
                { sid: sid },
                {
                    $push: {
                        users_connected: {
                            name: name,
                            location: location,
                            permission: permission,
                        },
                    },
                },
                { new: true },
                (err: any, session: any): void | Response => {
                    if (err)
                        return errorWithStatusAndJson(err, res, 500, {
                            success: false,
                            message: err,
                        });

                    if (!session || session.password !== password)
                        return errorWithStatusAndJson(
                            `Could not find session with sid: ${sid}`,
                            res,
                            404,
                            {
                                success: false,
                                message: 'Session not found',
                            },
                        );

                    return infoWithStatusAndJson(
                        `Successfully connected user ${name} to session ${sid}`,
                        res,
                        201,
                        {
                            success: true,
                            accepted: accepted,
                            permission: permission,
                            message: 'Success',
                            files: files,
                        },
                    );
                },
            );
        },
    );
};

export {};
