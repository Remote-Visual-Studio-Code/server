import jwt from 'jsonwebtoken';

export function validateSid(sid: string): boolean {
    const uuidRegex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$', 'i');
    return uuidRegex.test(sid);
}

export function validateToken(token: string): boolean {
    try {
        jwt.verify(token, process.env.JWT_SECRET || 'secret');
        return true;
    } catch (err) {
        return false;
    }
}
