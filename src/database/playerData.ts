import { Prisma } from '@prisma/client';
import type { CommandInteraction } from 'discord.js';

export async function getLinkedPlayerTags(interaction: CommandInteraction) {
    const data = await interaction.client.db.players.findFirst({
        where: { discordId: interaction.user.id },
        select: { playerTag: true }
    });

    return data ? data.playerTag : null;
}

export async function linkPlayerTag(interaction: CommandInteraction, playerTag: string) {
    try {
        await interaction.client.db.players.create({ data: { discordId: interaction.user.id, playerTag } });
        await interaction.reply({ content: `Successfully linked player tag - ${playerTag} to your account!` });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                await interaction.editReply({ content: `Player tag - ${playerTag} is already linked to your account` });
            }
        }
    }
}
