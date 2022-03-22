import type { Clan } from 'clashofclans.js';
import type { Client } from 'discord.js';
import { ENV } from '../utils/EnvValidator';

export = {
    name: 'onMemberJoin',

    filter: (oldClan: Clan, newClan: Clan) => {
        const oldTags = oldClan.members.map((member) => member.tag);
        if (oldTags.length === 0) return false;

        const newMembers = newClan.members.filter((member) => !oldTags.includes(member.tag));
        if (newMembers.length === 0) return false;
        return true;
    },

    async execute(client: Client, oldClan: Clan, newClan: Clan) {
        const channel = await client.channels.fetch(ENV.MEMBER_REPORTING_CHANNEL_ID, { force: false });
        if (!channel) return;

        newClan.members.forEach(async (member) => {
            if (!oldClan.members.find((oldMember) => oldMember.tag === member.tag)) {
                channel.isText() && (await channel.send(`${member.name} joined ${newClan.name}`));
            }
        });
    }
};
