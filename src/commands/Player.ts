import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import { Util } from 'clashofclans.js';

export = {
    data: new SlashCommandBuilder()
        .setName('player')
        .setDescription('Get the info of a player')
        .addStringOption((option) => option.setName('tag').setDescription('The player tag').setRequired(true)),

    async execute(interaction: CommandInteraction) {
        const playerTag = interaction.options.getString('tag');

        if (!Util.isValidTag(Util.formatTag(playerTag!))) {
            return interaction.reply({ content: `${playerTag} isn't a valid player tag!`, ephemeral: true });
        }

        try {
            await interaction.deferReply();
            const player = await interaction.client.coc.getPlayer('#2PP');
            const embed = new MessageEmbed().setTitle(`${player.name}`).setThumbnail(player.league.icon.url);
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            // @ts-expect-error no type for error
            if (error.reason === 'notFound') {
                await interaction.editReply({ content: `$Failed to find player with ${playerTag}!` });
            } else {
                await interaction.editReply({ content: 'Something went wrong, try again!' });
            }
        }
    }
};
