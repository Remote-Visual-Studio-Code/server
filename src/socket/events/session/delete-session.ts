import * as Session from '../../../models/Session';
import SocketEvent from '../../Event';
import jwt from 'jsonwebtoken';

export default class DeleteSessionEvent extends SocketEvent<{ token: string }> {
    constructor() {
        super('session.delete-session', async (data: { token: string }) => {
            if (!this.socket) return;

            if (!data.token) {
                this.socket.emit('session.session-deleted', { success: false, error: 'Invalid token' });
                return;
            }

            let decoded;

            try {
                const secret = process.env.JWT_SECRET;

                if (!secret) throw new Error('No JWT secret');

                decoded = jwt.verify(data.token, secret) as {
                    sid: string;
                    password: string;
                };
            } catch (ex: any) {
                this.socket.emit('session.session-deleted', { success: false, error: 'Invalid session' });
                return;
            }

            const valid = await Session.validate(decoded);

            if (!valid) {
                this.socket.emit('session.session-deleted', { success: false, error: 'Invalid session' });
                return;
            }

            const removed = await Session.remove(decoded);

            if (!removed) {
                this.socket.emit('session.session-deleted', { success: false, error: 'Failed to remove session' });
                return;
            }

            this.socket.emit('session.session-deleted', { success: true });
        });
    }
}
