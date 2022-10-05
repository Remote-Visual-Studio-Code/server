import * as Session from '../../../models/Session';
import Event from '../../Event';
import jwt from 'jsonwebtoken';

export default class UserConnectEvent extends Event<{ token: string; password: string; user: string }> {
    constructor() {
        super('user.kick', async (data: { token: string; password: string; user: string }) => {
            if (!this.socket) return;
            if (!this.server) return;

            const { token, password, user } = data;

            if (!token || !password || !user) {
                this.socket.emit('user.kicked', { success: false, error: 'Invalid request' });
                return;
            }

            let decoded;

            try {
                const secret = process.env.JWT_SECRET;

                if (!secret) throw new Error('No JWT secret');

                decoded = jwt.verify(data.token, secret) as { sid: string };
            } catch (ex: any) {
                this.socket.emit('user.kicked', { success: false, error: 'Invalid session' });
                return;
            }

            const sid = decoded.sid;

            const valid = await Session.validate({ sid, password });

            if (!valid) {
                this.socket.emit('user.kicked', { success: false, error: 'Invalid session' });
                return;
            }

            const session = await Session.find({ sid, password });

            if (!session) {
                this.socket.emit('user.kicked', { success: false, error: 'Invalid session' });
                return;
            }

            const user_connected = session.users_connected.find((u) => u.user === user);

            if (!user_connected) {
                this.socket.emit('user.kicked', { success: false, error: 'User not connected' });
                return;
            }

            Session.remove_user({ sid, password }, user);

            this.server.local.emit('user.kick', { sid: sid, user: user });
        });
    }
}
