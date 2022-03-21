import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import { HTTPError, Util } from 'clashofclans.js';
import { getLinkedClanTag } from '../database/clanData';

const warStates: Record<string, string> = {
    preparation: 'Preparation day',
    inWar: 'Battle day',
    warEnded: 'War ended'
};

export = {
    data: new SlashCommandBuilder()
        .setName('war')
        .setDescription('Get the info of a clan war')
        .addStringOption((option) => option.setName('tag').setDescription('The clan tag')),

    async execute(interaction: CommandInteraction) {
        let clanTag = interaction.options.getString('tag');

        if (!clanTag) {
            const tag = await getLinkedClanTag(interaction.user.id);
            if (!tag) {
                return interaction.reply({
                    content:
                        "You haven't linked a clan to your account! Either run `/link` command to link clan to your account or provide clan tag as second argument",
                    ephemeral: true
                });
            }
            clanTag = tag;
        } else if (!Util.isValidTag(Util.formatTag(clanTag!))) {
            return interaction.reply({ content: `${clanTag} isn't a valid clan tag!`, ephemeral: true });
        }

        try {
            await interaction.deferReply();
            const war = await interaction.client.coc.getClanWar(clanTag!);
            if (!war) {
                return interaction.editReply({ content: `${clanTag} isn't in a war!` });
            }

            const embed = new MessageEmbed()
                .setTitle(`${war.clan.name}`)
                .setThumbnail(war.clan.badge.url)
                // I don't know what else to add in fields. You can find all the properties
                // available for war at - https://clashofclans.js.org/docs/api/classes/ClanWar
                .addFields(
                    { name: 'Opponent Clan', value: `${war.opponent.name}`, inline: true },
                    { name: 'War Size', value: `${war.teamSize}`, inline: false },
                    { name: 'War State', value: warStates[war.state], inline: false }
                )
                .setColor([0xe74c3c, 0x2980b9, 0x1abc9c, 0xe67e22, 0xf1c40f][Math.floor(Math.random() * 6)])
                .setURL(`https://link.clashofclans.com/en?action=OpenClanProfile&tag=${war.clan.tag.replace(/#/g, '')}`)
                .setTimestamp();
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            if (error instanceof HTTPError && error.message === 'notFound') {
                await interaction.editReply({ content: `$Failed to find clan with ${clanTag}!` });
            } else if (error instanceof HTTPError && error.reason === 'privateWarLog') {
                await interaction.editReply({ content: error.message });
            } else {
                console.error(error);
                await interaction.editReply({ content: 'Something went wrong, try again!' });
            }
        }
    }
};
