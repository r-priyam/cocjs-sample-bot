/* eslint-disable n/no-sync */
import fs from 'node:fs';
import path from 'node:path';

import { PrismaClient } from '@prisma/client';
import { Client as ClashClient } from 'clashofclans.js';
import { Client, Collection, GatewayIntentBits } from 'discord.js';

import { config } from './utils/EnvValidator';
import Logger from './utils/Logger';

import type { ClashEventFile, CommandFile, DiscordEventFile } from './utils/interfaces';

async function main() {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter((file) => file.endsWith('.js'));
    const clashEvents = fs.readdirSync(path.join(__dirname, 'clashEvents')).filter((file) => file.endsWith('.js'));
    const events = fs.readdirSync(path.join(__dirname, 'events')).filter((file) => file.endsWith('.js'));

    client.commands = new Collection();
    client.logger = new Logger();
    client.coc = new ClashClient({ cache: true });
    client.db = new PrismaClient();
    client.coc.events.addClans(config.clanTags.split(','));

    for (const file of commandFiles) {
        const command = (await import(path.join(__dirname, `commands/${file}`))) as CommandFile;
        // We only need the execute function of the command to run it
        // eslint-disable-next-line @typescript-eslint/unbound-method
        client.commands.set(command.slashCommand.name, { execute: command.execute });
    }

    await client.coc.login({
        email: config.clashEmail,
        password: config.clashPassword,
        keyCount: 1,
        keyName: config.projectName
    });

    for (const file of events) {
        const event = (await import(path.join(__dirname, `events/${file}`))) as DiscordEventFile;
        // Register discord events callbacks
        client.on(event.name, (...args) => {
            event.execute(client, ...args);
        });
    }

    for (const file of clashEvents) {
        const event = (await import(path.join(__dirname, `clashEvents/${file}`))) as ClashEventFile;
        // Set custom clan events. Same can be done for war and player too.
        client.coc.events.setClanEvent({
            name: event.name,
            filter: (...args) => event.filter(...args)
        });
        // Register callback to execute when event is triggered
        client.coc.on(event.name, async (...args) => {
            await event.execute(client, ...args);
        });
    }

    client.on('error', (error) => {
        client.logger.error(error, { label: 'ERROR' });
    });

    client.on('warn', (error) => {
        client.logger.warn(error, { label: 'WARN' });
    });

    await client.login(config.botToken);
    await client.coc.events.init();
}

void main();
