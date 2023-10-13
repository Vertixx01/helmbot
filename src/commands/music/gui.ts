import { ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Colors, ComponentType, EmbedBuilder, GuildMember, SlashCommandBuilder } from "discord.js";
import CustomClient from "src/classes/customClient";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gui")
        .setDescription("Send a GUI to control the music"),
    async execute(interaction: ChatInputCommandInteraction, client: CustomClient) {
        const skipVotes = await client.db.supabase.from("music").select("votes").then();
        const { options, guild, channel } = interaction;
        const member = guild.members.cache.get(interaction.user.id);
        const voiceChannel = guild.members.cache.get(interaction.user.id).voice.channel;
        const queue = client.music.getQueue(interaction);
        const vccount = Math.ceil(guild.members.cache.get(interaction.user.id).voice.channel.members.size - 1);
        const buttons = [
            new ButtonBuilder()
                .setCustomId("pause")
                .setLabel("Pause")
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("resume")
                .setLabel("Resume")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("skip")
                .setLabel("Skip")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("stop")
                .setLabel("Stop")
                .setStyle(ButtonStyle.Danger),
        ];
        try {
            const msg = await interaction.reply({ content: "Control GUI", components: [{ type: 1, components: buttons }] });
            const collector = msg.createMessageComponentCollector({
                componentType: ComponentType.Button,
            });
            collector.on('collect', async (i) => {
                const member = i.member as GuildMember;
                if (i.customId === "skip") {
                    if (vccount === 1) {
                        await i.deferReply();
                        await i.followUp({
                            embeds: [new EmbedBuilder()
                                .setColor(Colors.Green)
                                .setDescription("Skipped the song")
                            ],
                        });
                        client.music.skip(interaction);
                        await i.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Green")
                                    .setTitle(`🎶 Playing`)
                                    .setDescription(`[${queue.songs[0].name}](${queue.songs[0].url})`)
                                    .setFields(
                                        { name: `**Requested By**`, value: `${queue.songs[0].user}`, inline: true },
                                        { name: `**Duration**`, value: `${humanizeDuration(queue.songs[queue.songs.length - 1].duration * 1000)}`, inline: true },
                                        { name: `**Queue**`, value: `${queue.songs.length - 1} song(s) - ${queue.formattedDuration}`, inline: true },
                                        { name: `**Volume**`, value: `${queue.volume}%`, inline: true },
                                        { name: `**Bitrate**`, value: `${voiceChannel.bitrate / 1000}kbps`, inline: true },
                                    )
                                    .setThumbnail(queue.songs[0].thumbnail)
                            ]
                        });
                    } else {
                        if (member.permissions.has("Administrator")) {
                            await i.deferReply();
                            await i.followUp({
                                embeds: [new EmbedBuilder()
                                    .setColor(Colors.Green)
                                    .setDescription("Skipped the song")
                                ],
                            });
                            client.music.skip(interaction);
                        } else {
                            if (skipVotes.data.includes(i.user.id as any)) {
                                await i.deferReply();
                                i.followUp({
                                    embeds: [new EmbedBuilder()
                                        .setColor(Colors.Green)
                                        .setDescription("You already voted to skip this song")
                                    ],
                                });
                            } else {
                                skipVotes.data.push(i.user.id as any);
                                console.log(`Skip Votes: ${skipVotes.data.length}/${vccount}`)
                                await i.deferReply();
                                i.followUp({
                                    embeds: [new EmbedBuilder()
                                        .setColor(Colors.Green)
                                        .setDescription(`You voted to skip this song. ${skipVotes.data.length}/${vccount}`)
                                    ]
                                });
                                if (skipVotes.data.length >= vccount) {
                                    client.music.skip(interaction);
                                    await client.db.supabase.from("music").update({ votes: [], vc_count: vccount }).then();
                                }
                            }
                        }
                    }
                }
                else if (i.customId === "pause") {
                    if (!voiceChannel) {
                        await i.deferReply();
                        await i.followUp({
                            embeds: [new EmbedBuilder()
                                .setColor(Colors.Green)
                                .setDescription("You must be in a voice channel to use this command")
                            ]
                        });
                    } else {
                        await i.deferReply();
                        await i.followUp({
                            embeds: [new EmbedBuilder()
                                .setColor(Colors.Green)
                                .setDescription("Paused the music")
                            ]
                        });
                        client.music.pause(interaction);
                    }
                }
                else if (i.customId === "resume") {
                    if (!voiceChannel) {
                        await i.deferReply();
                        await i.followUp({
                            embeds: [new EmbedBuilder()
                                .setColor(Colors.Green)
                                .setDescription("You must be in a voice channel to use this command")
                            ]
                        });
                    } else {
                        await i.deferReply();
                        await i.followUp({
                            embeds: [new EmbedBuilder()
                                .setColor(Colors.Green)
                                .setDescription("Resumed the music")
                            ]
                        });
                        client.music.resume(interaction);
                    }
                }
                else if (i.customId === "stop") {
                    if (member.permissions.has("Administrator")) {
                        await i.deferReply();
                        await i.followUp({
                            embeds: [new EmbedBuilder()
                                .setColor(Colors.Green)
                                .setDescription("Stopped the music")
                            ]
                        });
                        client.music.stop(interaction);
                        await client.db.supabase.from("music").update({ votes: [], vc_count: vccount }).then();
                    } else {
                        await i.deferReply();
                        await i.followUp({
                            embeds: [new EmbedBuilder()
                                .setColor(Colors.Green)
                                .setDescription("You do not have permission to stop the music")
                            ]
                        });
                    }
                }
            });
        } catch (e) {
            console.log(e);
        }
    }
}

function humanizeDuration(arg0: number) {
    throw new Error("Function not implemented.");
}
