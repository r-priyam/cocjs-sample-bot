import { InteractionType } from 'discord.js';

import type { Client, Interaction } from 'discord.js';

export const name = 'interactionCreate';

export async function execute(client: Client, interaction: Interaction) {
    if (interaction.type !== InteractionType.ApplicationCommand) {
        return;
    }

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        return interaction.reply({ content: 'Command not found!', ephemeral: true });
    }

    try {
        await command.execute(interaction);
    } catch (error: unknown) {
        client.logger.error(error, { label: 'COMMAND' });
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
}
