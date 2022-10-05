import { io as sock, stopExpress } from '../src/server';
import io from 'socket.io-client';

describe('Socket', () => {
    let client: any;

    afterAll(() => {
        client.disconnect();
        stopExpress();
        sock.close();
    });

    afterEach(() => {
        if (client) client.removeAllListeners();
    });

    it('Should return "Successfully connected to socket server" upon connecting', () => {
        client = io('http://localhost:8080');

        client.on('connected', (data: any) => {
            expect(data).toEqual('Successfully connected to socket server');
        });
    });

    if (!client) return;

    it('Should return "Invalid sid" when generating token with invalid sid', () => {
        client.emit('generate.token', JSON.stringify({ sid: '123456789' }));

        client.on('token.generated', (data: any) => {
            expect(JSON.parse(data)).toEqual({ error: 'Invalid sid', token: null });
        });
    });

    it('Should return a token when generating token with valid sid', () => {
        client.emit('generate.token', JSON.stringify({ sid: '12345678-1234-1234-1234-123456789012' }));

        client.on('token.generated', (data: any) => {
            expect(JSON.parse(data)).toHaveProperty('token');
        });
    });
});
