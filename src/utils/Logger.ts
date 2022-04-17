import dayjs from 'dayjs';
import pc from 'picocolors';
import util from 'util';

const coleredTag = (type: string) => {
    switch (type) {
        case 'debug':
            return pc.magenta(pc.bold('[DEBUG]'));
        case 'info':
            return pc.cyan(pc.bold('[INFO ]'));
        case 'warn':
            return pc.yellow(pc.bold('[WARN ]'));
        case 'error':
            return pc.red(pc.bold('[ERROR]'));
        default:
            return pc.cyan(pc.bold('[INFO ]'));
    }
};

export default class Logger {
    private static write(message: string | any, { error, label, tag }: { error?: boolean; label?: string; tag: string }) {
        const timestamp = pc.blue(pc.bold(dayjs().format('DD-MM-YYYY hh:mm:ss')));
        const content = this.clean(message);
        const stream = error ? process.stderr : process.stdout;
        stream.write(`[${timestamp}] ${coleredTag(tag)} » ${label ? `${pc.cyan(`[${label}]`)} » ` : ''}${pc.white(content)}\n`);
    }

    private static clean(message: string | any) {
        if (typeof message === 'string') {
            return message;
        }

        return util.inspect(message, { depth: Infinity });
    }

    public debug(message: string | any, { label }: { label?: string }) {
        (this.constructor as typeof Logger).write(message, { label, tag: 'debug' });
    }

    public info(message: string | any, { label }: { label?: string }) {
        (this.constructor as typeof Logger).write(message, { label, tag: 'info' });
    }

    public error(message: string | any, { label }: { label?: string }) {
        (this.constructor as typeof Logger).write(message, { error: true, label, tag: 'error' });
    }

    public warn(message: string | any, { label }: { label?: string }) {
        (this.constructor as typeof Logger).write(message, { label, tag: 'warn' });
    }
}
