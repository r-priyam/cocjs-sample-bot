import path from 'path';
import fs from 'node:fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import env from 'dotenv';
import Logger from './utils/Logger';
env.config();

async function syncCommands() {
    const commands = [];
    const LOGGER = new Logger();
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!);
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = await import(path.join(__dirname, `commands/${file}`));
        commands.push(command.data.toJSON());
    }

    // guild only commands syncs fast, helpful for testing
    rest.put(Routes.applicationGuildCommands(process.env.BOT_CLIENT_ID!, process.env.TEST_GUILD_ID!), { body: commands })
        .then(() => LOGGER.info('Successfully registered application commands.', { label: 'Commands Sync' }))
        .catch(console.error);
}

syncCommands().finally(() => process.exit(0));
