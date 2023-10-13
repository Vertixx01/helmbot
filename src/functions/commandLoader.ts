import loadFiles from "./fileLoader";
import CustomClient from "../classes/customClient";

async function loadCommands(client: CustomClient) {
    const { commands, config, guilds, application } = client;
    commands.clear();

    let loaded = 0;
    let failed = 0;
    let commandArray = [];

    const files = await loadFiles("src/commands");
    for (const file of files) {
        const command: any = await import(file);
        if (!command.data.name) return failed++;

        commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
        loaded++;
    }

    if (loaded !== 0) console.log(`Loaded ${loaded} commands`);
    if (failed !== 0) console.log(`Failed to load ${failed} commands`);

    if (config.global) {
        application?.commands.set(commandArray);
    } else {
        const guild = guilds.cache.get(config.devguildid);
        if (!guild) return console.log("Failed to find guild");

        guild.commands.set(commandArray);
    }
}

export default loadCommands;
