import { HTTPError, Util } from 'clashofclans.js';
import { SlashCommandBuilder } from 'discord.js';

import { linkClanTag } from '../database/clanData';
import { linkPlayerTag } from '../database/playerData';

import type { ChatInputCommandInteraction } from 'discord.js';

export const slashCommand = new SlashCommandBuilder()
    .setName('link')
    .setDescription('Link player or clan to your discord account')
    .addStringOption((option) =>
        option
            .setName('type')
            .setDescription('Choose what to link')
            .setRequired(true)
            .addChoices({ name: 'Player', value: 'link_player' }, { name: 'Clan', value: 'link_clan' })
    )
    .addStringOption((option) => option.setName('tag').setDescription('The tag to link').setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
    const type = interaction.options.getString('type');
    const tag = interaction.options.getString('tag');

    if (!Util.isValidTag(Util.formatTag(tag!))) {
        return interaction.reply({ content: `${tag!} isn't a valid tag!`, ephemeral: true });
    }

    await interaction.deferReply();
    if (type === 'link_player') {
        try {
            const player = await interaction.client.coc.getPlayer(tag!);
            await linkPlayerTag(interaction, player.tag);
        } catch (error: unknown) {
            await (error instanceof HTTPError && error.message === 'notFound'
                ? interaction.editReply({ content: `$Failed to find player with ${tag!}!` })
                : interaction.editReply({ content: 'Something went wrong, try again!' }));
        }
    } else if (type === 'link_clan') {
        try {
            const clan = await interaction.client.coc.getClan(tag!);
            await linkClanTag(interaction, clan.tag);
        } catch (error: unknown) {
            await (error instanceof HTTPError && error.message === 'notFound'
                ? interaction.editReply({ content: `$Failed to find clan with ${tag!}!` })
                : interaction.editReply({ content: 'Something went wrong, try again!' }));
        }
    }
}
