import fs from 'node:fs';

import path from 'path';
import { Client as ClashClient } from 'clashofclans.js';
import { Client, Collection, Intents } from 'discord.js';

import { PrismaClient } from '@prisma/client';

import { ENV } from './utils/EnvValidator';
import Logger from './utils/Logger';

async function main() {
    const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter((file) => file.endsWith('.js'));
    const clashEvents = fs.readdirSync(path.join(__dirname, 'clashEvents')).filter((file) => file.endsWith('.js'));
    const events = fs.readdirSync(path.join(__dirname, 'events')).filter((file) => file.endsWith('.js'));

    client.commands = new Collection();
    client.logger = new Logger();
    client.coc = new ClashClient({ cache: true });
    client.db = new PrismaClient();
    client.coc.events.addClans(ENV.CLAN_TAGS.split(','));

    for (const file of commandFiles) {
        const command = await import(path.join(__dirname, `commands/${file}`));
        // we only need the execute function of the command to run it
        client.commands.set(command.SlashCommand.name, { execute: command.execute });
    }

    await client.coc.login({
        email: ENV.CLASH_EMAIL,
        password: ENV.CLASH_PASSWORD!,
        keyCount: 1,
        keyName: ENV.PROJECT_NAME
    });

    for (const file of events) {
        const event = await import(path.join(__dirname, `events/${file}`));
        // register discord events callbacks
        client.on(event.name, async (...args) => await event.execute(client, ...args));
    }

    for (const file of clashEvents) {
        const event = await import(path.join(__dirname, `clashEvents/${file}`));
        // Set custom clan events. Same can be done for war and player too.
        client.coc.events.setClanEvent({
            name: event.name,
            filter: (...args) => event.filter(...args)
        });
        // register callback to execute when event is triggered
        client.coc.on(event.name, async (...args) => await event.execute(client, ...args));
    }

    client.on('error', (error) => client.logger.error(error, { label: 'ERROR' }));
    client.on('warn', (error) => client.logger.warn(error, { label: 'WARN' }));

    await client.login(ENV.BOT_TOKEN);
    await client.coc.events.init();
}

main();
