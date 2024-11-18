const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sue')
        .setDescription('Sue someone')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user you want to sue')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for suing')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();

        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');

        await interaction.followUp(`${interaction.user.username} is suing ${target.username} for ${reason}.`);
    },
};
