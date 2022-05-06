/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
abstract class Exception {
    private message: string;
    private name: string;

    constructor(message: string) {
        this.message = message;

        this.name = this.constructor.name;

        console.error(this.toString());
    }

    public toString(): string {
        return `${this.name}: ${this.message}`;
    }

    public getName(): string {
        return this.name;
    }

    public getMessage(): string {
        return this.message;
    }
}

class ClientServerConnectionRefusedException extends Exception {
    constructor(message: string) {
        super(message);
    }
}

class ServerConnectionRefusedException extends Exception {
    constructor(message: string) {
        super(message);
    }
}

class FileNotFoundException extends Exception {
    constructor(message: string) {
        super(message);
    }
}
