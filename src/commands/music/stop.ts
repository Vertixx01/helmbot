import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import CustomClient from "src/classes/customClient";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Allows you to change the volume of the music"),
    async execute(interaction: ChatInputCommandInteraction, client: CustomClient) {
        const { guild } = interaction;
        const member = guild.members.cache.get(interaction.user.id);
        try {
            if (member.permissions.has("Administrator")) {
                client.music.stop(interaction);
                await interaction.reply({ content: "Stopped the music" });
            } else {
                await interaction.reply({ content: "You must be an administrator to use this command" });
            }
        } catch (e) {}
    }
}
