import { GatewayIntentBits, Partials } from 'discord.js';
import CustomClient from './classes/customClient';
import loadEvents from './functions/eventLoader';
import { REST, Routes } from 'discord.js';
require('dotenv').config();

const client = new CustomClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
    ],
});

process.on("uncaughtException", (err) => {
    console.error(err);
});
// const rest = new REST().setToken(process.env.TOKEN);
// rest.put(Routes.applicationCommands("859693583719858196"), { body: [] })
// 	.then(() => console.log('Successfully deleted all application commands.'))
// 	.catch(console.error);
loadEvents(client);
client.on("error", () => { client.login(process.env.TOKEN) });
client.login(process.env.TOKEN);
