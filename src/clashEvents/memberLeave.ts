import { ChannelType } from 'discord.js';

import { config } from '../utils/EnvValidator';

import type { Clan } from 'clashofclans.js';
import type { Client } from 'discord.js';

export const name = 'onMemberLeave';

export function filter(oldClan: Clan, newClan: Clan) {
    const newTags = newClan.members.map((member) => member.tag);
    if (newTags.length === 0) {
        return false;
    }

    const leftMembers = oldClan.members.filter((member) => !newTags.includes(member.tag));
    return leftMembers.length !== 0;
}

export async function execute(client: Client, oldClan: Clan, newClan: Clan) {
    const channel = await client.channels.fetch(config.memberReportingChannelId, { force: false });
    if (!channel) {
        return;
    }

    for (const member of oldClan.members) {
        if (!newClan.members.some((newMember) => newMember.tag === member.tag) && channel.type === ChannelType.GuildText) {
            await channel.send(`${member.name} left ${newClan.name}`);
        }
    }
}
