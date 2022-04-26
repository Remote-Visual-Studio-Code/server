import { Request, Response } from 'express';
import { Session } from '../../../../models/Session';

export default (req: Request, res: Response): void | Response => {
    if (!req.body) return res.sendStatus(400);

    const { name } = req.body;
    const { sid } = req.body;

    if (!name || !sid) return res.sendStatus(400);

    Session.findOne({ sid: sid }, (err: any, session: any): void | Response => {
        if (err) return res.sendStatus(500);

        if (!session) return res.sendStatus(404);

        session.users_connected.forEach((user: { name: string }) => {
            if (user.name === name) {
                session.users_connected.splice(
                    session.users_connected.indexOf(user),
                    1,
                );
            }
        });

        session.save((err: any) => {
            if (err) return res.sendStatus(500);

            return res.sendStatus(200);
        });
    });
};

export {};
