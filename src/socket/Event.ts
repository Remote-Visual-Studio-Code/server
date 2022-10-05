// @ts-ignore - weird error, not recognizing socket.io types
import { Socket, Server } from 'socket.io';

export default class Event<T> {
    private _name: string;
    private _callback: (data: T) => void;
    private _socket: Socket | null;
    private _server: Server | null;

    constructor(name: string, callback: (data: T) => void, socket?: Socket, server?: Server) {
        this._name = name;
        this._callback = callback;
        this._socket = socket || null;
        this._server = server || null;
    }

    public fire(socket: Socket, server: Server): (data: T) => void {
        this._socket = socket;
        this._server = server;

        return this._callback;
    }

    get name(): string {
        return this._name;
    }

    get callback(): (data: string) => void {
        return (d: string) => {
            this._callback(JSON.parse(d));
        };
    }

    set socket(socket: Socket | null) {
        this._socket = socket;
    }

    get socket(): Socket | null {
        return this._socket;
    }

    set server(server: Server | null) {
        this._server = server;
    }

    get server(): Server | null {
        return this._server;
    }
}
