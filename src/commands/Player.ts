import { SlashCommandBuilder } from '@discordjs/builders';
import { HTTPError, Util } from 'clashofclans.js';
import type { CommandInteraction } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { getLinkedPlayerTags } from '../database/playerData';

export const slashCommand = new SlashCommandBuilder()
    .setName('player')
    .setDescription('Get the info of a player')
    .addStringOption((option) => option.setName('tag').setDescription('The player tag'));

export async function execute(interaction: CommandInteraction) {
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
        const embed = new MessageEmbed()
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
                { name: 'Attcks/Defense', value: `${player.attackWins}/${player.defenseWins}`, inline: false }
            )
            .setColor([0xe74c3c, 0x2980b9, 0x1abc9c, 0xe67e22, 0xf1c40f][Math.floor(Math.random() * 6)])
            .setURL(`https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${player.tag.replace(/#/g, '')}`)
            .setTimestamp();
        await interaction.editReply({ embeds: [embed] });
    } catch (error: unknown) {
        if (error instanceof HTTPError && error.message === 'notFound') {
            await interaction.editReply({ content: `$Failed to find player with ${playerTag}!` });
        } else {
            await interaction.editReply({ content: 'Something went wrong, try again!' });
        }
    }
}
