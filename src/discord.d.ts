import type Logger from './utils/Logger';
import type { PrismaClient } from '@prisma/client';
import type { PollingClient as ClashClient } from 'clashofclans.js'; // Client >> Polling Client
import type { Collection } from 'discord.js';

declare module 'discord.js' {
    export interface Client {
        coc: ClashClient;
        commands: Collection<string, { execute(...args: unknown[]): AsyncFunction }>;
        db: PrismaClient;
        logger: Logger;
    }
}
