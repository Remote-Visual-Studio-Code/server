import { Request, Response, Application } from 'express';
import jwt from 'jsonwebtoken';

export function encrypt(req: Request, res: Response): void {
    const { data } = req.body;

    const parsed = JSON.parse(data);

    const token = jwt.sign({ ...parsed }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '1h',
    });

    res.status(201).json({
        token,
    });
}

export function verify(req: Request, res: Response): void {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        res.status(200).json({
            valid: true,
            decoded: decoded,
        });
    } catch (error) {
        res.status(401).json({
            valid: false,
            decoded: null,
        });
    }
}

export default function load(app: Application): void {
    app.post('/token/encrypt', encrypt);
    app.post('/token/verify', verify);
}
