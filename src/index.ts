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
// const rest = new REST().setToken(process.env.TOKEN);
// rest.put(Routes.applicationCommands("859693583719858196"), { body: [] })
// 	.then(() => console.log('Successfully deleted all application commands.'))
// 	.catch(console.error);
loadEvents(client);
client.login(process.env.TOKEN);
