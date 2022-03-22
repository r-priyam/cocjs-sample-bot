import type { Client, Interaction } from 'discord.js';

export = {
    name: 'interactionCreate',
    execute: async (client: Client, interaction: Interaction) => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            return await interaction.reply({ content: 'Command not found!', ephemeral: true });
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            client.logger.error(error, { label: 'COMMAND' });
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};
