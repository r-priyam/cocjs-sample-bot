import { Prisma, PrismaClient } from '@prisma/client';
import type { CommandInteraction } from 'discord.js';

const prisma = new PrismaClient();

async function getLinkedClanTag(discordId: string) {
    const data = await prisma.clans.findFirst({
        where: { discordId },
        select: { clanTag: true }
    });

    return data ? data.clanTag : null;
}

async function linkClanTag(interaction: CommandInteraction, discordId: string, clanTag: string) {
    try {
        await prisma.clans.create({ data: { discordId, clanTag } });
        await interaction.reply({ content: `Successfully linked clan tag ${clanTag} to your account!` });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                await interaction.editReply({ content: `Clan tag - ${clanTag} is already linked to your account` });
            }
        }
    }
}

export { getLinkedClanTag, linkClanTag };
