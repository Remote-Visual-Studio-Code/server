// @ts-ignore - weird error, not recognizing socket.io types
import { Server, Socket } from 'socket.io';
import http from 'http';

import Event from './Event';

const port = Number(process.env.SOCK_PORT) || 8080;

export default async function socket(events: Event<any>[] = []): Promise<Server> {
    const server = http.createServer();
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });

    io.on('connection', (socket: Socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.emit('connected', JSON.stringify({ message: 'Connected to socket server' }));

        events.forEach((event: Event<any>) => {
            socket.on(event.name, event.fire(socket, io));
        });
    });

    server.listen(port, () => {
        console.log(`Started socket server on port ${port}`);
    });

    return io;
}
