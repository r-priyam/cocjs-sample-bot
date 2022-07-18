import type { Clan } from 'clashofclans.js';
import { ChannelType, Client } from 'discord.js';

import { config } from '../utils/EnvValidator';

export const name = 'onMemberLeave';

export function filter(oldClan: Clan, newClan: Clan) {
    const newTags = newClan.members.map((member) => member.tag);
    if (newTags.length === 0) {
        return false;
    }

    const leftMembers = oldClan.members.filter((member) => !newTags.includes(member.tag));
    if (leftMembers.length === 0) {
        return false;
    }

    return true;
}

export async function execute(client: Client, oldClan: Clan, newClan: Clan) {
    const channel = await client.channels.fetch(config.memberReportingChannelId, { force: false });
    if (!channel) {
        return;
    }

    oldClan.members.forEach(async (member) => {
        if (!newClan.members.find((newMember) => newMember.tag === member.tag) && channel.type === ChannelType.GuildText) {
            await channel.send(`${member.name} left ${newClan.name}`);
        }
    });
}
