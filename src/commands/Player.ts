import { HTTPError, Util } from 'clashofclans.js';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import { getLinkedPlayerTags } from '../database/playerData';

import type { ChatInputCommandInteraction } from 'discord.js';

export const slashCommand = new SlashCommandBuilder()
    .setName('player')
    .setDescription('Get the info of a player')
    .addStringOption((option) => option.setName('tag').setDescription('The player tag'));

export async function execute(interaction: ChatInputCommandInteraction) {
    let playerTag = interaction.options.getString('tag');

    if (!playerTag) {
        const tag = await getLinkedPlayerTags(interaction);
        if (!tag) {
            return interaction.reply({
                content:
                    "You haven't linked a player to your account! Either run `/link` command to link player to your account or provide player tag as second argument",
                ephemeral: true
            });
        }

        playerTag = tag;
    } else if (!Util.isValidTag(Util.formatTag(playerTag))) {
        return interaction.reply({ content: `${playerTag} isn't a valid player tag!`, ephemeral: true });
    }

    try {
        await interaction.deferReply();
        const player = await interaction.client.coc.getPlayer(playerTag);
        const embed = new EmbedBuilder()
            .setTitle(`${player.name}`)
            .setThumbnail(player.league.icon.url)
            // https://clashofclans.js.org/docs/api/interfaces/APIPlayer
            .addFields(
                { name: 'Exp. Level', value: `${player.expLevel}`, inline: false },
                { name: 'Town Hall', value: `${player.townHallLevel}`, inline: false },
                { name: 'War Stars', value: `${player.warStars}`, inline: false },
                { name: 'Trophies', value: `${player.trophies}`, inline: false },
                { name: 'Donations', value: `${player.donations}`, inline: false },
                { name: 'Donations Received', value: `${player.received}`, inline: false },
                { name: 'Attacks/Defense', value: `${player.attackWins}/${player.defenseWins}`, inline: false }
            )
            .setColor([0xe7_4c_3c, 0x29_80_b9, 0x1a_bc_9c, 0xe6_7e_22, 0xf1_c4_0f][Math.floor(Math.random() * 6)])
            .setURL(`https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${player.tag.replaceAll('#', '')}`)
            .setTimestamp();
        await interaction.editReply({ embeds: [embed] });
    } catch (error: unknown) {
        await (error instanceof HTTPError && error.message === 'notFound'
            ? interaction.editReply({ content: `$Failed to find player with ${playerTag}!` })
            : interaction.editReply({ content: 'Something went wrong, try again!' }));
    }
}
