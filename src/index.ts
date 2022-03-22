import path from 'path';
import fs from 'node:fs';
import { Client, Collection, Intents } from 'discord.js';
import { Client as ClashClient } from 'clashofclans.js';
import Logger from './utils/Logger';
import { ENV } from './utils/EnvValidator';

const LOGGER = new Logger();
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.coc = new ClashClient({ cache: true });
client.commands = new Collection();

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
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = await import(path.join(__dirname, `commands/${file}`));
        // we only need the execute function of the command to run it
        client.commands.set(command.data.name, { execute: command.execute });
    }

    await client.coc.login({
        email: ENV.CLASH_EMAIL,
        password: ENV.CLASH_PASSWORD!,
        keyCount: 1,
        keyName: ENV.PROJECT_NAME
    });
    await client.login(ENV.BOT_TOKEN);
}

main()
    .catch((error) => LOGGER.error(error, { label: 'MAIN' }))
    .finally(() => LOGGER.info(`Successfully Logged In! as ${client.user!.username}`, { label: 'MAIN' }));
