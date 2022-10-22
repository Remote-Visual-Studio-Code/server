import logger from '../../../util/logger';
import SocketEvent from '../../Event';
import jwt from 'jsonwebtoken';

import { validateSid } from '../../../util/util';

const JWT_SECRET = process.env.JWT_SECRET;

export default class TokenGenerateEvent extends SocketEvent<{ sid: string }> {
    constructor() {
        super('token.generate', (data: { sid: string }) => {
            if (!this.socket) return;

            if (!JWT_SECRET) throw new Error('No JWT secret');

            logger.debug(`Generating token for ${this.socket.id} with data: ${data}`);

            const { sid } = data;

            if (!sid) {
                logger.debug('No sid provided');

                this.socket.emit('token.generated', { success: false, error: 'Invalid session ID', token: null });
                return;
            }

            if (!validateSid(sid)) {
                logger.debug(`Invalid sid: ${sid}`);

                this.socket.emit(
                    'token.generated',
                    JSON.stringify({ success: false, error: 'Invalid sid', token: null }),
                );

                return;
            }

            const token = jwt.sign({ sid: sid }, JWT_SECRET, {
                expiresIn: '1h',
            });

            logger.debug(`Generated token for ${this.socket.id}: ${token}`);

            this.socket.emit('token-generated', JSON.stringify({ sucess: true, token: token, error: null }));
        });
    }
}
