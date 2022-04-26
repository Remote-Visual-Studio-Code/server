import { Response } from 'express';
import colors, { Color } from 'colors';

function _getCallerFileName() {
    const original = Error.prepareStackTrace;
    let caller;

    try {
        const err = new Error();
        let current;

        Error.prepareStackTrace = (_err: any, stack: any) => {
            return stack;
        };

        if (!err.stack) return null;

        // @ts-ignore
        current = err.stack.shift().getFileName();

        while (err.stack.length) {
            // @ts-ignore
            caller = err.stack.shift().getFileName();

            if (current !== caller) break;
        }
    } catch (err) {}

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

function _log(message: string, color: Color, overrideLocation?: string): void {
    const location = overrideLocation
        ? overrideLocation
        : replacement(
              capitalizeFirstLetter(
                  _getCallerFileName()
                      .split('.')[0]
                      .split('/')
                      .pop()
                      .split('\\')
                      .pop()
                      .replace('index', 'main'),
              ),
          );

    console.log(
        `${colors.bold(LOCATION_COLOR(`[${location}]`))} ${color(message)}`,
    );
}

const info = (message: string, overrideLocation?: string): void => {
    if (overrideLocation) _log(message, MESSAGE_COLOR, overrideLocation);
    else _log(message, MESSAGE_COLOR);
};

const warn = (message: string, overrideLocation?: string): void => {
    if (overrideLocation) _log(message, colors.yellow, overrideLocation);
    _log(message, colors.yellow);
};

const error = (message: string, overrideLocation?: string): void => {
    if (overrideLocation) _log(message, colors.red, overrideLocation);
    _log(message, colors.red);
};

const infoWithStatus = (
    message: string,
    res: Response,
    status: number,
    overrideLocation?: string,
): Response => {
    if (overrideLocation) _log(message, MESSAGE_COLOR, overrideLocation);
    info(message);
    return res.status(status);
};

const warnWithStatus = (
    message: string,
    res: Response,
    status: number,
    overrideLocation?: string,
): Response => {
    if (overrideLocation) _log(message, colors.yellow, overrideLocation);
    warn(message);
    return res.status(status);
};

const errorWithStatus = (
    message: string,
    res: Response,
    status: number,
    overrideLocation?: string,
): Response => {
    if (overrideLocation) _log(message, colors.red, overrideLocation);
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
    if (overrideLocation) _log(message, MESSAGE_COLOR, overrideLocation);
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
    if (overrideLocation) _log(message, colors.yellow, overrideLocation);
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
    if (overrideLocation) _log(message, colors.red, overrideLocation);
    error(message);
    return res.status(status).json(json);
};

export {
    info,
    warn,
    error,
    infoWithStatus,
    warnWithStatus,
    errorWithStatus,
    infoWithStatusAndJson,
    warnWithStatusAndJson,
    errorWithStatusAndJson,
};
