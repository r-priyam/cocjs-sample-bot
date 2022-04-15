import type { PrismaClient } from '@prisma/client';
import type { Client as ClashClient } from 'clashofclans.js';
import type { Collection } from 'discord.js';
import type Logger from './utils/Logger';

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, { execute: (...args: unknown[]) => AsyncFunction }>;
        coc: ClashClient;
        logger: Logger;
        db: PrismaClient;
    }
}
