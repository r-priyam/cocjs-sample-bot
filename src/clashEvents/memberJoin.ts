import { ChannelType } from 'discord.js';

import { config } from '../utils/EnvValidator';

import type { Clan } from 'clashofclans.js';
import type { Client } from 'discord.js';

export const name = 'onMemberJoin';

export function filter(oldClan: Clan, newClan: Clan) {
    const oldTags = oldClan.members.map((member) => member.tag);
    if (oldTags.length === 0) {
        return false;
    }

    const newMembers = newClan.members.filter((member) => !oldTags.includes(member.tag));
    return newMembers.length !== 0;
}

export async function execute(client: Client, oldClan: Clan, newClan: Clan) {
    const channel = await client.channels.fetch(config.memberReportingChannelId, { force: false });
    if (!channel) {
        return;
    }

    for (const member of newClan.members) {
        if (!oldClan.members.some((oldMember) => oldMember.tag === member.tag) && channel.type === ChannelType.GuildText) {
            await channel.send(`${member.name} joined ${newClan.name}`);
        }
    }
}
