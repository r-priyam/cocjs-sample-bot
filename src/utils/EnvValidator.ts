import env from 'dotenv';
import joi from 'joi';

env.config();

interface EnviromentVariables {
    DATABASE_URL: string;
    CLASH_EMAIL: string;
    CLASH_PASSWORD: string;
    PROJECT_NAME: string;
    BOT_CLIENT_ID: string;
    TEST_GUILD_ID: string;
    BOT_TOKEN: string;
}

const envVarsSchema = joi
    .object()
    .keys({
        DATABASE_URL: joi.string().valid().required(),
        CLASH_EMAIL: joi.string().email().required(),
        CLASH_PASSWORD: joi.string().required(),
        PROJECT_NAME: joi.string().required(),
        BOT_CLIENT_ID: joi.string().required(),
        TEST_GUILD_ID: joi.string().required(),
        BOT_TOKEN: joi.string().required()
    })
    .unknown();

const validate = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
const ENV = validate.value as EnviromentVariables;

if (validate.error) {
    throw new Error(`Config validation error: ${validate.error.message}`);
}

export { ENV };
