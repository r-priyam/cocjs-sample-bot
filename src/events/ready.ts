import type { Client } from 'discord.js';

export const name = 'ready';

export function execute(client: Client) {
    client.logger.info('Bot is ready!', { label: 'READY' });
}
