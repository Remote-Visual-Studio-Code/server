import colors, { Color } from 'colors';
import { Response } from 'express';

function getCallerFileName(): any {
    const original = Error.prepareStackTrace;
    let caller;

    try {
        const err = new Error();

        Error.prepareStackTrace = (_err: any, stack: any): any => {
            return stack;
        };

        if (!err.stack) return null;

        // @ts-ignore
        const current = err.stack.shift().getFileName();

        while (err.stack.length) {
            // @ts-ignore
            caller = err.stack.shift().getFileName();

            if (current !== caller) break;
        }
    } catch (err) {
        /* empty */
    }

    Error.prepareStackTrace = original;
    return caller;
}

const LOCATION_COLOR = colors.blue;
const MESSAGE_COLOR = colors.blue;

const REPLACEMENTS = [
    {
        name: 'Api',
        replacement: 'API',
    },
];

function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function replacement(name: string): string {
    return REPLACEMENTS.find(r => r.name === name)?.replacement ?? name;
}

function log(
    msg: string,
    color: Color,
    overrideLocation?: string,
    error?: any,
): void {
    const location =
        overrideLocation ||
        replacement(
            capitalizeFirstLetter(
                getCallerFileName()
                    .split('.')[0]
                    .split('/')
                    .pop()
                    .split('\\')
                    .pop()
                    .replace('index', 'main'),
            ),
        );

    const message = error ? `${msg}: ${error}` : msg;

    console.log(
        `${colors.bold(LOCATION_COLOR(`[${location}]`))} ${color(message)}`,
    );
}

const info = (message: string, overrideLocation?: string): void => {
    if (overrideLocation) log(message, MESSAGE_COLOR, overrideLocation);
    else log(message, MESSAGE_COLOR);
};

const warn = (message: string, overrideLocation?: string): void => {
    if (overrideLocation) log(message, colors.yellow, overrideLocation);
    else log(message, colors.yellow);
};

const error = (message: string, overrideLocation?: string): void => {
    if (overrideLocation) log(message, colors.red, overrideLocation);
    else log(message, colors.red);
};

const errorThrow = (
    message: string,
    error?: any,
    overrideLocation?: string,
): void => {
    log(message, colors.red, overrideLocation || undefined, error || undefined);
};

const infoWithStatus = (
    message: string,
    res: Response,
    status: number,
    overrideLocation?: string,
): Response => {
    if (overrideLocation) log(message, MESSAGE_COLOR, overrideLocation);
    info(message);
    return res.status(status);
};

const warnWithStatus = (
    message: string,
    res: Response,
    status: number,
    overrideLocation?: string,
): Response => {
    if (overrideLocation) log(message, colors.yellow, overrideLocation);
    warn(message);
    return res.status(status);
};

const errorWithStatus = (
    message: string,
    res: Response,
    status: number,
    overrideLocation?: string,
): Response => {
    if (overrideLocation) log(message, colors.red, overrideLocation);
    error(message);
    return res.status(status);
};

const infoWithStatusAndJson = (
    message: string,
    res: Response,
    status: number,
    json: any,
    overrideLocation?: string,
): Response => {
    if (overrideLocation) log(message, MESSAGE_COLOR, overrideLocation);
    info(message);
    return res.status(status).json(json);
};

const warnWithStatusAndJson = (
    message: string,
    res: Response,
    status: number,
    json: any,
    overrideLocation?: string,
): Response => {
    if (overrideLocation) log(message, colors.yellow, overrideLocation);
    warn(message);
    return res.status(status).json(json);
};

const errorWithStatusAndJson = (
    message: string,
    res: Response,
    status: number,
    json: any,
    overrideLocation?: string,
): Response => {
    if (overrideLocation) log(message, colors.red, overrideLocation);
    error(message);
    return res.status(status).json(json);
};

export {
    info,
    warn,
    error,
    errorThrow,
    infoWithStatus,
    warnWithStatus,
    errorWithStatus,
    infoWithStatusAndJson,
    warnWithStatusAndJson,
    errorWithStatusAndJson,
};
