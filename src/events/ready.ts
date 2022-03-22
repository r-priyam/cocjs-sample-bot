import type { Client } from 'discord.js';

export = {
    name: 'ready',
    execute: async (client: Client) => {
        client.logger.info('Bot is ready!', { label: 'READY' });
    }
};
