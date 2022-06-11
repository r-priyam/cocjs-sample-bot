import fs from 'node:fs';
import path from 'node:path';

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import env from 'dotenv';

import { config } from './utils/EnvValidator';
import { CommandFile } from './utils/interfaces';
import Logger from './utils/Logger';

env.config();

async function syncCommands() {
    const commands = [];
    const logger = new Logger();
    const rest = new REST({ version: '10' }).setToken(config.botToken);
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
