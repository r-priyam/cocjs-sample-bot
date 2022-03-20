// github.com/csuvajit/escapebot/blob/master/src/bot/util/Logger.ts

import util from 'util';
import dayjs from 'dayjs';
import { style } from '@ogma/styler';

const ColeredTag = (type: string) => {
    switch (type) {
        case 'debug':
            return style.yellow.bold.apply('[DEBUG]');
        case 'info':
            return style.cyan.bold.apply('[INFO ]');
        case 'warn':
            return style.magenta.apply('[WARN ]');
        case 'error':
            return style.red.apply('[ERROR]');
    }
};

export default class Logger {
    public debug(message: string | any, { label }: { label?: string }) {
        return (this.constructor as typeof Logger).write(message, { label, tag: 'debug' });
    }

    public info(message: string | any, { label }: { label?: string }) {
        return (this.constructor as typeof Logger).write(message, { label, tag: 'info' });
    }

    public error(message: string | any, { label }: { label?: string }) {
        return (this.constructor as typeof Logger).write(message, { error: true, label, tag: 'error' });
    }

    public warn(message: string | any, { label }: { label?: string }) {
        return (this.constructor as typeof Logger).write(message, { label, tag: 'warn' });
    }

    private static write(message: string | any, { error, label, tag }: { error?: boolean; label?: string; tag: string }) {
        const timestamp = style.cyan.bold.apply(dayjs().format('DD-MM-YYYY hh:mm:ss'));
        const content = this.clean(message);
        const stream = error ? process.stderr : process.stdout;
        stream.write(`[${timestamp}] ${ColeredTag(tag)} » ${label ? `[${label}] » ` : ''}${content}\n`);
    }

    private static clean(message: string | any) {
        if (typeof message === 'string') return message;
        return util.inspect(message, { depth: Infinity });
    }
}
