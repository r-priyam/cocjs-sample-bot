import { SlashCommandBuilder } from '@discordjs/builders';
import { HTTPError, Util } from 'clashofclans.js';
import type { CommandInteraction } from 'discord.js';
import { linkClanTag } from '../database/clanData';
import { linkPlayerTag } from '../database/playerData';

export = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Link player or clan to your discord account')
        .addStringOption((option) =>
            option
                .setName('type')
                .setDescription('Choose what to link')
                .setRequired(true)
                .addChoice('Player', 'link_player')
                .addChoice('Clan', 'link_clan')
        )
        .addStringOption((option) => option.setName('tag').setDescription('The tag to link').setRequired(true)),

    async execute(interaction: CommandInteraction) {
        const type = interaction.options.getString('type');
        const tag = interaction.options.getString('tag');

        if (!Util.isValidTag(Util.formatTag(tag!))) {
            return interaction.reply({ content: `${tag} isn't a valid tag!`, ephemeral: true });
        }

        if (type === 'link_player') {
            try {
                const player = await interaction.client.coc.getPlayer(tag!);
                await linkPlayerTag(interaction, interaction.user.id, player.tag);
            } catch (error) {
                if (error instanceof HTTPError && error.message === 'notFound') {
                    await interaction.editReply({ content: `$Failed to find player with ${tag}!` });
                } else {
                    await interaction.editReply({ content: 'Something went wrong, try again!' });
                }
            }
        } else if (type === 'link_clan') {
            try {
                const clan = await interaction.client.coc.getClan(tag!);
                await linkClanTag(interaction, interaction.user.id, clan.tag);
            } catch (error) {
                if (error instanceof HTTPError && error.message === 'notFound') {
                    await interaction.editReply({ content: `$Failed to find clan with ${tag}!` });
                } else {
                    await interaction.editReply({ content: 'Something went wrong, try again!' });
                }
            }
        }
    }
};
