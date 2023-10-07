import { CommandInteraction, EmbedBuilder, ModalBuilder } from "discord.js"

class Interactions {
    public async reply(interaction: any, message: string, ephemeral: boolean) {
        const embed = new EmbedBuilder().setColor("#FF0000").setDescription(message);
        return await interaction.reply({
            embeds: [embed],
            ephemeral: ephemeral
        });
    }

    public async edit(interaction: any, data: EmbedBuilder) {
        await interaction.deferUpdate();
        return await interaction.editReply({
            embeds: [data]
        });
    }

    public async delete(interaction: any) {
        await interaction.deferUpdate();
        return await interaction.deleteReply();
    }

    public async showModal(interaction: any, data: ModalBuilder) {
        return interaction.showModal(data);
    }
}

export default Interactions;
