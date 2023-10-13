import CustomClient from "../classes/customClient";
import config from "../../configs/config.json";
import { Events, Message } from "discord.js";

module.exports = {
    name: Events.MessageCreate,
    async execute(message: Message, client: CustomClient) {
        if (!message.content.startsWith(config.prefix) || message.author.bot) return;

        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (!client.commands.has(commandName)) return;

        const command: any = client.commands.get(commandName);

        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
}
