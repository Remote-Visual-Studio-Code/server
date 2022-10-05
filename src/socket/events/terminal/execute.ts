import * as Session from '../../../models/Session';
import Event from '../../Event';
import jwt from 'jsonwebtoken';

/**
 * Execute a command in the client's terminal.
 * Sent by the UI when the user presses enter in the terminal.
 */
export default class ExecuteCommandEvent extends Event<{
    token: string;
    password: string;
    command: string;
    args: string[];
}> {
    constructor() {
        super(
            'terminal.execute',
            async (data: { token: string; password: string; command: string; args: string[] }) => {
                if (!this.socket) return;
                if (!this.server) return;

                const { token, password, command, args } = data;

                if (!token || !password || !command || !args) {
                    this.socket.emit('terminal.execute', { success: false, error: 'Invalid request' });
                    return;
                }

                let sid: string;

                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { sid: string };
                    sid = decoded.sid;
                } catch (ex) {
                    this.socket.emit('terminal.execute', { success: false, error: 'Invalid session' });
                    return;
                }

                const valid = await Session.validate({ sid, password });

                if (!valid) {
                    this.socket.emit('terminal.execute', { success: false, error: 'Invalid session' });
                    return;
                }

                const session = await Session.find({ sid, password });

                if (!session) {
                    this.socket.emit('terminal.execute', { success: false, error: 'Invalid session' });
                    return;
                }

                this.server.local.emit('terminal.execute-cmd', {
                    auth: { sid, password },
                    command,
                    args,
                });

                const socket = this.socket;

                this.server.on(
                    'terminal.execute-cmd-response',
                    (data: { auth: { sid: string; password: string }; data: { bytes: string[] } }) => {
                        if (data.auth.sid !== sid || data.auth.password !== password) return;

                        socket.emit('terminal.execute-byte-recv', { success: true, bytes: data.data.bytes });
                    },
                );

                this.server.on(
                    'terminal.execute-cmd-response-end',
                    (data: { auth: { sid: string; password: string }; data: { bytes: string[] } }) => {
                        if (data.auth.sid !== sid || data.auth.password !== password) return;

                        socket.emit('terminal.execute-end', { success: true, bytes: data.data.bytes });
                    },
                );
            },
        );
    }
}
