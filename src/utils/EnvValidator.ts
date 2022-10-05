import process from 'node:process';

import env from 'dotenv';
import joi from 'joi';

env.config();

interface EnvironmentVariables {
    botClientId: string;
    botToken: string;
    clanTags: string;
    clashEmail: string;
    clashPassword: string;
    memberReportingChannelId: string;
    projectName: string;
    testGuildId: string;
}

const envVarsSchema = joi
    .object()
    .keys({
        clashEmail: joi.string().email().required(),
        clashPassword: joi.string().required(),
        projectName: joi.string().required(),
        botClientId: joi.string().required(),
        testGuildId: joi.string().required(),
        botToken: joi.string().required(),
        clanTags: joi.string().required(),
        memberReportingChannelId: joi.string().required()
    })
    .unknown();

const validate = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (validate.error) {
    throw new Error(`Config validation error: ${validate.error.message}`);
}

export const config = validate.value as EnvironmentVariables;
