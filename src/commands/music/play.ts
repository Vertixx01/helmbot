import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import CustomClient from "../../classes/customClient";
import humanizeDuration from "humanize-duration";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song")
        .addStringOption(option =>
            option
                .setName("query")
                .setDescription("Enter a song name or URL")
                .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction, client: CustomClient) {
        const { options, guild, channel } = interaction;
        const query = options.getString("query");
        const member = guild.members.cache.get(interaction.user.id);
        const voiceChannel = guild.members.cache.get(interaction.user.id).voice.channel;

        const embed = new EmbedBuilder();

        if (!voiceChannel) {
            embed.setColor(client.color)
                .setDescription("You must be in a voice channel to use this command")
            return channel.send({ embeds: [embed] })
        }

        if (guild.members.me.voice.channel && voiceChannel.id !== guild.members.me.voice.channel.id) {
            return channel.send({
                embeds: [new EmbedBuilder()
                    .setColor("Red")
                    .setTitle(`I'm already connected to a voice channel. -> <#${guild.members.me.voice.channel.id}>`)
                ],
            });
        }

        let newmsg = await interaction.reply({
            content: `🔍 Searching... \`\`\`${query}\`\`\``,
        })
        try {
            await client.music.play(voiceChannel, query, { textChannel: channel, member })
            const queue = client.music.getQueue(interaction);
            if (queue && queue.songs.length > 1) {
                await client.music.play(voiceChannel, query, { textChannel: channel, member })
                newmsg.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setTitle(`🎶 Added to queue`)
                            .setDescription(`[${queue.songs[queue.songs.length - 1].name}](${queue.songs[queue.songs.length - 1].url})`)
                            .setFields(
                                { name: `**Requested By**`, value: `${queue.songs[queue.songs.length - 1].user}`, inline: true },
                                { name: `**Duration**`, value: `${humanizeDuration(queue.songs[queue.songs.length - 1].duration * 1000)}`, inline: true },
                                { name: `**Queue**`, value: `${queue.songs.length} song(s) - ${queue.formattedDuration}`, inline: true },
                                { name: `**Volume**`, value: `${queue.volume}%`, inline: true },
                                { name: `**Bitrate**`, value: `${voiceChannel.bitrate / 1000}kbps`, inline: true },
                            )
                            .setThumbnail(queue.songs[queue.songs.length - 1].thumbnail)
                    ]
                })
            } else {
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
                ]
                newmsg.edit({
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
                    ],
                    components: [
                        {
                            type: 1,
                            components: buttons
                        }
                    ]
                })
            }
        } catch (e) {
            console.log(e.stack ? e.stack : e)
            interaction.reply({
                content: `An error occured: \`\`\`${e}\`\`\``,
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`\`\`\`${e}\`\`\``)
                ],

            })
        }
    }
};
