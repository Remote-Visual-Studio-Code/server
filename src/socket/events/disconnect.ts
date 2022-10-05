import logger from '../../util/logger';
import SocketEvent from '../Event';

export default class DisconnectEvent extends SocketEvent<Record<string, never>> {
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        super('disconnect', (_data: Record<string, never>) => {
            if (!this.socket) return;

            logger.debug(`Socket disconnected: ${this.socket.id} (${this.socket.handshake.address})`);

            this.socket.removeAllListeners();
        });
    }
}
