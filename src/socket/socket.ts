// @ts-ignore - weird error, not recognizing socket.io types
import { Server, Socket } from 'socket.io';
import http from 'http';

import SocketEvent from './SocketEvent';

const port = Number(process.env.SOCK_PORT) || 8080;

export default async function socket(events: SocketEvent<any>[] = []): Promise<Server> {
    const server = http.createServer();
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });

    io.on('connection', (socket: Socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.emit('connected', JSON.stringify({ message: 'Connected to socket server' }));

        events.forEach((event: SocketEvent<any>) => {
            socket.on(event.name, event.fire(socket));
        });
    });

    server.listen(port, () => {
        console.log(`Started socket server on port ${port}`);
    });

    return io;
}
