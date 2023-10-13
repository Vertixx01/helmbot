import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } from "discord.js";
import CustomClient from "../../classes/customClient";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows the queue of songs"),
    async execute(interaction: ChatInputCommandInteraction, client: CustomClient) {
        let queue = client.music.getQueue(interaction);
        if (!queue) return interaction.reply({ embeds: [new EmbedBuilder().setColor("Red").setDescription("There is no queue")] });
        const menu = new ActionRowBuilder()
        const dropdown = new StringSelectMenuBuilder()
            .setCustomId('musicqueue')
            .setPlaceholder('Nothing selected')
            .setMaxValues(1)
            .setMinValues(1)
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle("Queue")
            .setTimestamp()
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            })
        let channel = interaction.guild.members.cache.get(interaction.user.id).voice.channel;
        if (!channel) return interaction.reply({ embeds: [new EmbedBuilder().setColor("Red").setDescription("You must be in a voice channel to use this command")] });
        if (queue.playing) {
            let embedsc = queue.songs.map((song, i) => {
                return `${i + 1}. [${song.name}](${song.url}) \`[${song.formattedDuration}]\``
            })
            embedsc = [...new Set(embedsc)];
            const nodupequeue = [...new Set(queue.songs)];
            nodupequeue.map((song, i) => {
                dropdown.addOptions([
                    {
                        label: `${i + 1}. ${song.name}`,
                        description: `Duration: ${song.formattedDuration}`,
                        value: `${i + 1}`,
                    }
                ])
            });
            const row = menu.addComponents([ dropdown ])
            embed.setDescription(`Now Playing: [${queue.songs[0].name}](${queue.songs[0].url}) \`[${queue.songs[0].formattedDuration}]\`\n\n${embedsc.join("\n")}`)
            interaction.reply({ embeds: [embed], components: [{
                type: 1,
                components: [ dropdown ]
            }] });

            const filter = (i) => i.user.id === interaction.user.id && i.isStringSelectMenu();

            const collector = interaction.channel.createMessageComponentCollector({ filter });

            collector.on('collect', async i => {
                if (i.customId === 'musicqueue') {
                    if (i.isStringSelectMenu()) {
                        const value = i.values[0];
                        for (let i = 0; i < queue.songs.length; i++) {
                            if (value === `${i + 1}`) {
                                client.music.jump(interaction, i)
                                break;
                            }
                        }
                        await i.deferUpdate();
                        await i.followUp({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`Jumped to song ${value}`)
                            ]
                        });
                    }
                }
            });
        }
    }
}
