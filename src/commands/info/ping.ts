import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import CustomClient from "../../classes/customClient";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Shows the bot's ping"),

    execute(interaction: ChatInputCommandInteraction, client: CustomClient) {
        const embed = new EmbedBuilder().setColor("#FF0000").setDescription(`Pong! \`${client.ws.ping}ms\``)
        interaction.reply({
            embeds: [embed],
        })
    }
}
