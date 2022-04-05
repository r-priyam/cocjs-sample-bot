import type { Client as ClashClient } from 'clashofclans.js';
import type { Collection } from 'discord.js';

import type { PrismaClient } from '@prisma/client';

import type Logger from './utils/Logger';

declare module 'discord.js' {
    export interface Client {
        commands: Collection<any, any>;
        coc: ClashClient;
        logger: Logger;
        db: PrismaClient;
    }
}
