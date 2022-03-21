import { Prisma, PrismaClient } from '@prisma/client';
import type { CommandInteraction } from 'discord.js';

const prisma = new PrismaClient();

async function getLinkedPlayerTags(discordId: string) {
    const data = await prisma.players.findFirst({
        where: { discordId },
        select: { playerTag: true }
    });

    return data ? data.playerTag : null;
}

async function linkPlayerTag(interaction: CommandInteraction, discordId: string, playerTag: string) {
    try {
        await prisma.players.create({ data: { discordId, playerTag } });
        await interaction.reply({ content: `Successfully linked player tag - ${playerTag} to your account!` });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                await interaction.editReply({ content: `Player tag - ${playerTag} is already linked to your account` });
            }
        }
    }
}

export { getLinkedPlayerTags, linkPlayerTag };
