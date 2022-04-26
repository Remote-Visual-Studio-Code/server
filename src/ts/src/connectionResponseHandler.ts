/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars,no-restricted-syntax */
class StatusCode {
    static OK = 200;
    static CREATED = 201;
    static BAD_REQUEST = 400;
    static UNAUTHORIZED = 401;
    static FORBIDDEN = 403;
    static NOT_FOUND = 404;
    static CONFLICT = 409;
    static INTERNAL_SERVER_ERROR = 500;

    static getStatusText(code: number): string {
        switch (code) {
            case StatusCode.OK:
                return 'OK';
            case StatusCode.CREATED:
                return 'Created';
            case StatusCode.BAD_REQUEST:
                return 'Bad Request';
            case StatusCode.UNAUTHORIZED:
                return 'Unauthorized';
            case StatusCode.FORBIDDEN:
                return 'Forbidden';
            case StatusCode.NOT_FOUND:
                return 'Not Found';
            case StatusCode.CONFLICT:
                return 'Conflict';
            case StatusCode.INTERNAL_SERVER_ERROR:
                return 'Internal Server Error';
            default:
                return 'Unknown';
        }
    }

    static isSuccess(code: number): boolean {
        return code >= 200 && code < 300;
    }

    static isError(code: number): boolean {
        return !StatusCode.isSuccess(code);
    }

    static isClientError(code: number): boolean {
        return code >= 400 && code < 500;
    }

    static isServerError(code: number): boolean {
        return code >= 500 && code < 600;
    }

    static isRedirection(code: number): boolean {
        return code >= 300 && code < 400;
    }
}

class ConnectionResponse {
    statusCode: number;
    success: boolean;
    message: string;

    data: {
        success: boolean;
        accepted?: boolean;
        permission?: string;
        message: string;
    };

    constructor(
        statusCode: number,
        data: {
            success: boolean;
            accepted?: boolean;
            permission?: string;
            message: string;
        },
    ) {
        this.statusCode = statusCode;
        this.data = data;
        this.success = StatusCode.isSuccess(statusCode);
        this.message = this.data.message;
    }
}

class ConnectionResponseHandler {
    private response: ConnectionResponse;

    constructor(response: ConnectionResponse) {
        this.response = response;
    }

    get statusCode(): StatusCode {
        return this.response.statusCode;
    }

    get success(): boolean {
        return this.response.success;
    }

    get message(): string {
        return this.response.message;
    }

    get data(): any {
        return this.response.data;
    }

    get accepted(): boolean {
        if (
            (this.statusCode !== StatusCode.OK &&
                this.statusCode !== StatusCode.CREATED) ||
            !this.response.data.accepted
        )
            return false;

        return this.response.data.accepted;
    }

    get permission(): string | null {
        if (
            (this.statusCode !== StatusCode.OK &&
                this.statusCode !== StatusCode.CREATED) ||
            !this.response.data.permission
        )
            return null;

        return this.response.data.permission;
    }
}

const SUCCESS_MESSAGES = ['Success', 'Timed out'];

const ERROR_MESSAGES = [
    'Missing parameters',
    'Invalid permission',
    'Invalid location',
    'Session not found',
    'Invalid response',
    'Could not connect',
];

function validateResponseFromConnection(httpResponse: any): boolean {
    if (!httpResponse) return false;

    const data: {
        success: boolean;
        accepted?: boolean;
        permission?: string;
        message: string;
    } = {
        success: false,
        message: 'Unknown error',
    };

    if (httpResponse.success === undefined || !httpResponse.message)
        return false;
    data.success = httpResponse.success;
    data.message = httpResponse.message;

    if (httpResponse.accepted !== undefined)
        data.accepted = httpResponse.accepted;
    if (httpResponse.permission !== undefined)
        data.permission = httpResponse.permission;

    const response = new ConnectionResponse(httpResponse.statusCode, data);

    let isValid;

    for (const message of ERROR_MESSAGES) {
        if (response.message === message) {
            isValid = false;
            break;
        }
    }

    for (const message of SUCCESS_MESSAGES) {
        if (response.message === message) {
            isValid = true;
            break;
        }
    }

    if (!isValid) return false;

    return true;
}
