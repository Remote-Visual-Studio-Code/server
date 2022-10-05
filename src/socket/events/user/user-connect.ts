import * as Session from '../../../models/Session';
import SocketEvent from '../../Event';
import jwt from 'jsonwebtoken';

type UserPermission = 'viewer' | 'editor' | 'admin';

export default class UserConnectEvent extends SocketEvent<{
    token: string;
    password: string;
    user: string;
    location: string;
    permission: UserPermission;
}> {
    constructor() {
        super(
            'user.connect',
            async (data: {
                token: string;
                password: string;
                user: string;
                location: string;
                permission: UserPermission;
            }) => {
                if (!this.socket) return;
                if (!this.server) return;

                const { token, password, user, location, permission } = data;

                if (!token || !password || !user || !location || !permission) {
                    this.socket.emit('user.connected', { success: false, error: 'Invalid request' });
                    return;
                }

                let decoded;

                try {
                    decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
                        sid: string;
                    };
                } catch (ex: any) {
                    this.socket.emit('user.connect', { success: false, error: 'Invalid session' });
                    return;
                }

                const sid = decoded.sid;

                const valid = await Session.validate({ sid, password });

                if (!valid) {
                    this.socket.emit('user.connect', { success: false, error: 'Invalid session' });
                    return;
                }

                if (!['viewer', 'editor', 'admin'].includes(permission)) {
                    this.socket.emit('user.connect', { success: false, error: 'Invalid permission' });
                    return;
                }

                const session = await Session.find({ sid, password });

                if (!session) {
                    this.socket.emit('user.connect', { success: false, error: 'Invalid session' });
                    return;
                }

                this.server.local.emit('user.request-connection', {
                    sid: sid,
                    name: user,
                    location: location,
                    permission: permission,
                });

                const socket = this.socket;
                const server = this.server;

                this.server.on('user.request-connection-response', async (data: { sid: string; response: boolean }) => {
                    if (data.sid !== sid) return;

                    if (data.response) {
                        socket.emit('user.connect', { success: true, error: null });

                        await Session.add_user({ sid, password }, { user, permission });
                    } else {
                        socket.emit('user.connect', { success: false, error: 'Connection denied' });
                    }

                    server.removeListener('user.request-connection-response', () => {});
                });
            },
        );
    }
}
