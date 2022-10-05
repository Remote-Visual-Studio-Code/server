import * as Session from '../../../models/Session';
import SocketEvent from '../../SocketEvent';
import * as uuid from 'uuid';

export default class CreateSessionEvent extends SocketEvent<{ password: string; expires: string }> {
    constructor() {
        super('session.create-session', async (data: { password: string; expires: string }) => {
            if (!this.socket) return;

            const { password, expires } = data;

            if (!password) {
                console.log(`Invalid password: ${password}`);

                this.socket.emit('session.session-created', JSON.stringify({ error: 'Invalid password', sid: null }));

                return;
            }

            if (!expires) {
                console.log(`Invalid expiry date: ${expires}`);

                this.socket.emit(
                    'session.session-created',
                    JSON.stringify({ error: 'Invalid expiry date', sid: null }),
                );

                return;
            }

            const expiry: Date = new Date(expires);
            const sid = uuid.v4();

            if (!expiry || expiry.getTime() < Date.now()) {
                console.log(`Invalid expiry date: ${expires}`);

                this.socket.emit(
                    'session.session-created',
                    JSON.stringify({ error: 'Invalid expiry date', sid: null }),
                );

                return;
            }

            await Session.create({ sid: sid, password: password, expires: expiry });

            this.socket.emit('session.session-created', JSON.stringify({ sid: sid }));
        });
    }
}
