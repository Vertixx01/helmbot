import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import CustomClient from "../../classes/customClient";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Allows you to change the volume of the music")
        .addStringOption(option =>
            option
                .setName("volume")
                .setDescription("Enter a volume")
                .setRequired(false)
        ),
    async execute(interaction: ChatInputCommandInteraction, client: CustomClient) {
        let user = interaction.user;
        let guild = interaction.guild;
        let channel = guild.members.cache.get(interaction.user.id).voice.channel;
        let queue = client.music.getQueue(interaction);
        if (!queue) return channel.send({ embeds: [new EmbedBuilder().setColor("Red").setDescription("There is no queue")] });
        if (!channel) return channel.send({ embeds: [new EmbedBuilder().setColor("Red").setDescription("You must be in a voice channel to use this command")] });
        if (!queue.songs.length) return channel.send({ embeds: [new EmbedBuilder().setColor("Red").setDescription("There is no queue")] });
        if (queue.playing) {
            const menu = new StringSelectMenuBuilder()
                .setCustomId('volumemenu')
                .setPlaceholder('Nothing selected')
                .addOptions([
                    {
                        label: '100 Volume',
                        description: 'Sets the volume to 100%',
                        value: '100',
                    },
                    {
                        label: '75 Volume',
                        description: 'Sets the volume to 75%',
                        value: '75',
                    },
                    {
                        label: '50 Volume',
                        description: 'Sets the volume to 50%',
                        value: '50',
                    },
                    {
                        label: '25 Volume',
                        description: 'Sets the volume to 25%',
                        value: '25',
                    },
                    {
                        label: '0 Volume',
                        description: 'Mutes the music',
                        value: '0',
                    },
                ])
            const volume = interaction.options.getString("volume");
            if (volume) {
                if (isNaN(parseInt(volume))) return channel.send({ embeds: [new EmbedBuilder().setColor("Red").setDescription("Please enter a valid number")] });
                if (parseInt(volume) > 100) return channel.send({ embeds: [new EmbedBuilder().setColor("Red").setDescription("Please enter a number between 0 and 100")] });
                if (parseInt(volume) < 0) return channel.send({ embeds: [new EmbedBuilder().setColor("Red").setDescription("Please enter a number between 0 and 100")] });
                client.music.setVolume(interaction, parseInt(volume));
                await interaction.reply({
                    content: `Volume set to ${volume}`,
                });
            } else {
                const msg = await interaction.reply({
                    content: `Select a volume`,
                    components: [{
                        type: 1,
                        components: [menu]
                    }]
                });
                const collector = msg.createMessageComponentCollector();
                collector.on('collect', async i => {
                    if (i.isStringSelectMenu()) {
                        let value = i.values[0];
                        client.music.setVolume(interaction, parseInt(value));
                        await i.deferUpdate();
                        await i.followUp({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Green")
                                    .setDescription(`Volume set to ${value}%`)
                            ]
                        });
                    }
                });

            }
        }
    }
}
