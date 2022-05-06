// @ts-ignore
import log from '../web/log.json'; // eslint-disable-line import/no-unresolved

export = {
    get: (key: string): string => {
        return log[key];
    },
};
