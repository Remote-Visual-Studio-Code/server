import logger from '../../util/logger';
import SocketEvent from '../Event';

export default class DisconnectEvent extends SocketEvent<{}> {
    constructor() {
        super('disconnect', (_data: {}) => {
            if (!this.socket) return;

            logger.debug(`Socket disconnected: ${this.socket.id}`);

            this.socket.removeAllListeners();
        });
    }
}
