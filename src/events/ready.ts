import { ActivityType, Events } from "discord.js";
import CustomClient from "../classes/customClient";
import loadCommands from "../functions/commandLoader";

module.exports = {
    name: Events.ClientReady,

    execute(client: CustomClient) {
        loadCommands(client);
        console.log(`Logged in as ${client.user?.tag}`);
        client.user?.setActivity("with Vertixx", { type: ActivityType.Watching });
    }
}
