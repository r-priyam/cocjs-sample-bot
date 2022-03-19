import type { Collection } from 'discord.js';
import type { Client as ClashClient } from 'clashofclans.js';

declare module 'discord.js' {
    export interface Client {
        commands: Collection<any, any>;
        coc: ClashClient;
    }
}
