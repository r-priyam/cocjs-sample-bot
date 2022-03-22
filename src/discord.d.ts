import type { Collection } from 'discord.js';
import type { Client as ClashClient } from 'clashofclans.js';
import type Logger from './utils/Logger';

declare module 'discord.js' {
    export interface Client {
        commands: Collection<any, any>;
        coc: ClashClient;
        logger: Logger;
    }
}
