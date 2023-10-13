import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Colors, CommandInteraction, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import CustomClient from './customClient';
import config from '../../configs/config.json';

class Buttons {
    public async handleButton(interaction: ChatInputCommandInteraction, client: CustomClient) {
        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isButton()) {
                return;
            }
            switch (interaction.customId) {
                case "pause":
                    await interaction.deferReply();
                    await interaction.followUp({
                        embeds: [new EmbedBuilder()
                            .setColor(Colors.Green)
                            .setDescription("Paused the song")
                        ],
                    });
                    client.music.pause(interaction);
                    break;
                case "resume":
                    await interaction.deferReply();
                    await interaction.followUp({
                        embeds: [new EmbedBuilder()
                            .setColor(Colors.Green)
                            .setDescription("Resumed the song")
                        ],
                    });
                    client.music.resume(interaction);
                    break;
                case "stop":
                    await interaction.deferReply();
                    await interaction.followUp({
                        embeds: [new EmbedBuilder()
                            .setColor(Colors.Green)
                            .setDescription("Stopped the song")
                        ],
                    });
                    client.music.stop(interaction);
                    break;
            }
        });
    }
}

export default Buttons;
