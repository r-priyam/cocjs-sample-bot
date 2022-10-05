import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import env from 'dotenv';

import { config } from './utils/EnvValidator';
import Logger from './utils/Logger';

import type { CommandFile } from './utils/interfaces';

env.config();

async function syncCommands() {
    const commands = [];
    const logger = new Logger();
    const rest = new REST({ version: '10' }).setToken(config.botToken);
    // eslint-disable-next-line n/no-sync
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = (await import(path.join(__dirname, `commands/${file}`))) as CommandFile;
        commands.push(command.slashCommand.toJSON());
    }

    // Guild only commands syncs fast, helpful for testing
    await rest
        .put(Routes.applicationGuildCommands(config.botClientId, config.testGuildId), { body: commands })
        .then(() => {
            logger.info('Successfully registered application commands.', { label: 'Commands Sync' });
        })
        .catch(console.error);
}

syncCommands().finally(() => process.exit(0));
