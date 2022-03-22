import type { Clan } from 'clashofclans.js';
import type { Client } from 'discord.js';
import { ENV } from '../utils/EnvValidator';

export = {
    name: 'onMemberLeave',

    filter: (oldClan: Clan, newClan: Clan) => {
        const newTags = newClan.members.map((member) => member.tag);
        if (newTags.length === 0) return false;

        const leftMembers = oldClan.members.filter((member) => !newTags.includes(member.tag));
        if (leftMembers.length === 0) return false;
        return true;
    },

    async execute(client: Client, oldClan: Clan, newClan: Clan) {
        const channel = await client.channels.fetch(ENV.MEMBER_REPORTING_CHANNEL_ID, { force: false });
        if (!channel) return;

        oldClan.members.forEach(async (member) => {
            if (!newClan.members.find((newmember) => newmember.tag === member.tag)) {
                channel.isText() && (await channel.send(`${member.name} left ${newClan.name}`));
            }
        });
    }
};
