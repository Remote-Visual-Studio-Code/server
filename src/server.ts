import { Request, Response } from 'express';
// @ts-ignore - weird error, not recognizing socket.io types
import { Server } from 'socket.io';
import parser from 'body-parser';
import express from 'express';
import cors from 'cors';

// modules
import { connect } from './database/database';
import loadTokens from './token/tokens';
import socket from './socket/socket';
import Event from './socket/Event';
import logger from './util/logger';

// events
import DeleteSessionEvent from './socket/events/session/delete-session';
import CreateSessionEvent from './socket/events/session/create-session';
import UserConnectEvent from './socket/events/user/user-connect';
import GenerateTokenEvent from './socket/events/token/generate';
import UserKickEvent from './socket/events/user/kick-user';
import DisconnectEvent from './socket/events/disconnect';

const app: express.Application = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.use(cors({ origin: '*' }));

loadTokens(app);

app.get('/', (_req: Request, res: Response) => {
    res.json({
        hello: 'world',
    });
});

let connected: boolean = false;
let io: Server;
let serv: any;

(async () => {
    const events: Event<any>[] = [];

    events.push(new DeleteSessionEvent());
    events.push(new CreateSessionEvent());
    events.push(new UserConnectEvent());
    events.push(new GenerateTokenEvent());
    events.push(new UserKickEvent());
    events.push(new DisconnectEvent());

    io = await socket(events);

    connected = await connect();

    if (!connected) {
        logger.error('Could not connect to database');
        process.exit(1);
    } else {
        logger.info('Connected to database');
    }

    if (require.main === module) {
        serv = app.listen(port, () => {
            logger.info(`Started server on port ${port}`);
        });
    }
})();

export default app;
export { io };
export function stopExpress(): void {
    if (serv) serv.close();
}
