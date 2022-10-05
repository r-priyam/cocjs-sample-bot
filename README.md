[discord.js]: https://discord.js.org/#/
[discord.js-badge]: https://img.shields.io/npm/v/discord.js?label=discord.js
[clashofclans.js]: https://clashofclans.js.org/
[clashofclans.js-badge]: https://img.shields.io/npm/v/clashofclans.js?label=clashofclans.js

<div align="center">

## **Clash of Clans sample discord bot using [NodeJs](https://nodejs.org/en/)**

[![Continuous Integration](https://github.com/r-priyam/cocjs-smaple-bot/actions/workflows/continuous-integration.yml/badge.svg)](https://github.com/r-priyam/cocjs-smaple-bot/actions/workflows/continuous-integration.yml)

[![discord.js-badge][discord.js-badge]][discord.js]
[![clashofclans.js-badge][clashofclans.js-badge]][clashofclans.js]

![https://img.shields.io/github/issues/r-priyam/cocjs-smaple-bot](https://img.shields.io/github/issues/r-priyam/cocjs-smaple-bot)
![https://img.shields.io/github/forks/r-priyam/cocjs-smaple-bot](https://img.shields.io/github/forks/r-priyam/cocjs-smaple-bot)
![https://img.shields.io/github/license/r-priyam/cocjs-smaple-bot](https://img.shields.io/github/license/r-priyam/cocjs-smaple-bot)

[![Total alerts](https://img.shields.io/lgtm/alerts/g/r-priyam/cocjs-smaple-bot.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/r-priyam/cocjs-smaple-bot/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/r-priyam/cocjs-smaple-bot.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/r-priyam/cocjs-smaple-bot/context:javascript)

</div>

## Introduction

This sample bot project aims to help you get started with interacting [Clash of Clans API](https://developer.clashofclans.com/) using `discord.js` and `clashofclans.js`.

## Features

-   📝 Databse integration (PostgreSQL)
-   ✍️ Fully typechecked code
-   🚀 3 commands and 2 events
-   😎 It just works

More thing around, figure out on yourself 🤷‍♂️

## Before You Start

Before you dive into running this project, I expect you to have these things ready:

-   [NodeJs](https://nodejs.org/) (version>=16)
-   [Postgresql](https://www.postgresql.org/) installed locally and ruuning
-   [git](https://git-scm.com/) (This is required to clone the project on your local machine)
-   Account on [Clash of Clans API](https://developer.clashofclans.com/)
-   Bot account on [Discord](https://discord.com/developers/)

After completing the above steps, do invite the bot to your server.

## Important Links

-   [clashofclans.js Documentation](https://clashofclans.js.org/docs/)
-   [Clash of Clans Developer Website](https://developer.clashofclans.com/)
-   [Clash of Clans API Community Discord](https://discord.gg/Eaja7gJ)
-   [Discord Developer Website](https://discord.com/developers/)
-   [discord.js Documentation](https://discord.js.org/)
-   [discord.js Guide](https://discordjs.guide/)
-   [Prisma ORM docs](https://www.prisma.io/docs/)

## Getting Started

1. Clone the project using `git clone https://github.com/r-priyam/cocjs-smaple-bot.git`
2. Install dependencies using `npm install`
3. Make `.env` file in the project root directory and set the following values:
    - `DATABASE_URL`: Your postgres database connection string
    - `clashEmail` - Clash of Clans API account email address
    - `clashPassword` - Password for the account of `CLASH_EMAIL`
    - `projectName` - Your project name
    - `botClientId` - Bot client id
    - `testGuildId` - Guild id of the test guild in which bot was added
    - `botToken` - Discord bot token of your bot account created on [Discord](https://discord.com/developers/)
    - `clanTags`: Clan tags separated by comma to be added to the `clashofclans.js` for receiving clan events.
    - `memberReportingChannelId`: Channel id of the channel where member join/leave reporting is to be done.
4. Synchronize the Application commands(Slash commands) with the test guild using `npm run sync:commands`. This will add the commands to the test guild. Please note that it takes sometime to cache the commands in guild but not much when we are adding commands specifically for guild only. Have some patience.
5. Run the bot using `npm run start`.

Once the bot is running and slash commands are reflecting in the test server then you can try running the commands.

## Commands

-   `/player` - To get player information
-   `/clan` - To get clan information
-   `/war` - To get clan war information
-   `/link` - To link a clan or a player to your discord account.

Tag is an optional parameter in `/player`, `/clan` and `/war` commands. If you don't provide it then it will attempt to get the respective tag information from the database for the user who sent the command and will return the data for the first tag found in the database.

If you provide the tag then it will attempt to query the data directly from the API and will return the data for the tag provided.

## FAQ's

-   **Q:** Why it requires my Clash of Clans API account credentials?

    -   **A:** It is required to get the access token to interact with clash of clans api. If you don't want to give your account credentials, you can use the [Clash of Clans API](https://developer.clashofclans.com/) website directly to get the access token and then you can setup the `CLASH_TOKEN` environment variable. It will then require you do some extra steps to get the `clasofclans.js` to work.
        To use API token diectly do these changes in the following files -

        In `index.ts`

        ```diff
        - client.coc = new ClashClient({ cache: true });
        + client.coc = new ClashClient({ keys: [config.CLASH_TOKEN], cache: true });
        ```

        In `utils/EnvValidator.ts`

        ```diff
        interface EnviromentVariables {
            // ...
        +   CLASH_TOKEN: string;
        }

        const envVarsSchema = joi
        .object()
        .keys({
            // ...
        +   CLASH_TOKEN: joi.string().required(),
        })
        .unknown();
        ```

-   **Q:** Why adding commands to the test guild only and not globally?

    -   **A:** When adding commands globally then it takes at least 1 hour ~ to cache commands on discord side and then reflect in the servers in which bot is added into `but not much when we are adding commands specifically for guild only`. So, it is better to add commands to the test guild only when developing.

-   **Q:** How can I add commands globally?

    -   **A:** Please read discordjs guide [here](https://discordjs.guide/interactions/slash-commands.html#global-commands) and follow the steps to add commands globally.

-   **Q:** How can I add more commands?
    -   **A:** Please read discordjs guide [here](https://discordjs.guide/interactions/slash-commands.html#adding-commands) and follow the steps to add more commands.

If you have any questions or suggestions, please feel free to open an issue [here](https://github.com/r-priyam/cocjs-smaple-bot/issues/new).
