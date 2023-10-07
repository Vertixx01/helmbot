import { Client, Collection, Colors } from "discord.js";
import configuration from "../../configs/config.json";
import { SpotifyPlugin } from "@distube/spotify";
import { YtDlpPlugin } from "@distube/yt-dlp";
import { DisTube } from "distube";
import Interactions from "../../src/systems/messageInteractions";

class CustomClient extends Client {
  color = Colors.Blurple;
  config = configuration;
  commands = new Collection();
  buttons = new Collection();
  selectMenus = new Collection();
  interactions = new Interactions();
  music = new DisTube(this, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    plugins: [new SpotifyPlugin(), new YtDlpPlugin({ update: true })],
    customFilters: {
        bassboost: "bass=g=20,dynaudnorm=f=200",
        "8d": "apulsator=hz=0.08",
        vaporwave: "aresample=48000,asetrate=48000*0.8",
        nightcore: "aresample=48000,asetrate=48000*1.25",
        phaser: "aphaser=in_gain=0.4",
        subboost: "asubboost",
      },
  });
}

export default CustomClient;
