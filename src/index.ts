import path from 'path';
import fs from 'node:fs';
import { Client, Collection, Intents } from 'discord.js';
import { Client as ClashClient } from 'clashofclans.js';
import * as env from 'dotenv';
import Logger from './utils/Logger';
env.config();

const LOGGER = new Logger();
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.coc = new ClashClient({ cache: true });
client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command = require(path.join(__dirname, `commands/${file}`));
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    LOGGER.info('Bot is ready!', { label: 'MAIN' });
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        return await interaction.reply({ content: 'Command not found!', ephemeral: true });
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        LOGGER.error(error, { label: 'COMMAND' });
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

async function main() {
    await client.coc.login({
        email: process.env.CLASH_EMAIL!,
        password: process.env.CLASH_PASSWORD!,
        keyCount: 1,
        keyName: process.env.PROJECT_NAME
    });
    await client.login(process.env.BOT_TOKEN);
}

main()
    .catch((error) => LOGGER.error(error, { label: 'MAIN' }))
    .finally(() => LOGGER.info(`Successfully Logged In! as ${client.user!.username}`, { label: 'MAIN' }));
