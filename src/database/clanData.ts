import { Prisma } from '@prisma/client';
import type { CommandInteraction } from 'discord.js';

export async function getLinkedClanTag(interaction: CommandInteraction) {
    const data = await interaction.client.db.clans.findFirst({
        where: { discordId: interaction.user.id },
        select: { clanTag: true }
    });

    return data ? data.clanTag : null;
}

export async function linkClanTag(interaction: CommandInteraction, clanTag: string) {
    try {
        await interaction.client.db.clans.create({ data: { discordId: interaction.user.id, clanTag } });
        await interaction.reply({ content: `Successfully linked clan tag ${clanTag} to your account!` });
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            await interaction.editReply({ content: `Clan tag - ${clanTag} is already linked to your account` });
        }
    }
}
