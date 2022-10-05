import SocketEvent from '../../Event';
import jwt from 'jsonwebtoken';

import { validateSid } from '../../../util/util';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export default class TokenGenerateEvent extends SocketEvent<{ sid: string }> {
    constructor() {
        super('token.generate', (data: { sid: string }) => {
            if (!this.socket) return;

            console.log(`Generating token for ${this.socket.id} with data: ${data}`);

            const { sid } = data;

            if (!sid) {
                this.socket.emit('token.generated', { success: false, error: 'Invalid session ID' });
                return;
            }

            if (!validateSid(sid)) {
                console.log(`Invalid sid: ${sid}`);

                this.socket.emit('token.generated', JSON.stringify({ error: 'Invalid sid', token: null }));

                return;
            }

            const token = jwt.sign({ sid: sid }, JWT_SECRET, {
                expiresIn: '1h',
            });

            this.socket.emit('token-generated', JSON.stringify({ token: token }));
        });
    }
}
