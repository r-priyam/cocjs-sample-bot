import type { Client, Interaction } from 'discord.js';

export const name = 'interactionCreate';

export async function execute(client: Client, interaction: Interaction) {
    if (!interaction.isCommand()) {
        return;
    }

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        await interaction.reply({ content: 'Command not found!', ephemeral: true });
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error: unknown) {
        client.logger.error(error, { label: 'COMMAND' });
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
}
