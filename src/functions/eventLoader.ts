import CustomClient from "../classes/customClient";
import loadFiles from "./fileLoader";

async function loadEvents(client: CustomClient) {
    let loaded = 0;
    let failed = 0;
    const files: any = await loadFiles("src/events");
    files.forEach((file: any) => {
        const event = require(file);
        if (!event.name) return failed++;
        if (event.once) client.once(event.name, (...args: any) => event.execute(...args, client));
        else client.on(event.name, (...args: any) => event.execute(...args, client));
        loaded++;
    });
    if (loaded !== 0) console.log(`Loaded ${loaded} events`);
    if (failed !== 0) console.log(`Failed to load ${failed} events`);
}

export default loadEvents;
