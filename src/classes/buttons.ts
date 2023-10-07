import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Colors, CommandInteraction, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import CustomClient from './customClient';
import config from '../../configs/config.json';

class Buttons {
    public async handleButton(interaction: ChatInputCommandInteraction, client: CustomClient) {
        let serverQueue = {
            skipVotes: [],
        }
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
                case "skip":
                    const vccount = Math.ceil(interaction.guild.members.cache.get(interaction.user.id).voice.channel.members.size / 2);
                    if (config.devs.includes(interaction.user.id)) {
                        await interaction.deferReply();
                        await interaction.followUp({
                            embeds: [new EmbedBuilder()
                                .setColor(Colors.Green)
                                .setDescription("Skipped the song")
                            ],
                        });
                        client.music.skip(interaction);
                    } else {
                        if (vccount === 1) {
                            await interaction.deferReply();
                            await interaction.followUp({
                                embeds: [new EmbedBuilder()
                                    .setColor(Colors.Green)
                                    .setDescription("Skipped the song")
                                ],
                            });
                        } else {
                            if (serverQueue.skipVotes.includes(interaction.user.id)) {
                                await interaction.deferReply();
                                interaction.followUp({
                                    embeds: [new EmbedBuilder()
                                        .setColor(Colors.Green)
                                        .setDescription("You already voted to skip this song")
                                    ],
                                });
                            }
                            serverQueue.skipVotes.push(interaction.user.id);
                            await interaction.deferReply();
                            interaction.followUp({
                                embeds: [new EmbedBuilder()
                                    .setColor(Colors.Green)
                                    .setDescription(`${vccount - 1} more votes needed to skip the song.`)
                                ]
                            });
                            if (serverQueue.skipVotes.length >= vccount) {
                                await interaction.deferReply();
                                await interaction.followUp({
                                    embeds: [new EmbedBuilder()
                                        .setColor(Colors.Green)
                                        .setDescription("Skipped the song")
                                    ],
                                });
                                serverQueue.skipVotes = [];
                                client.music.skip(interaction);
                            }
                        }
                    }
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
