const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, GuildMemberRoleManager, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('assign')
        .setDescription('Assign a judge or a lawyer to a court case')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to be assigned')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('role')
                .setDescription('Role to assign (judge/lawyer)')
                .setRequired(true)
                .addChoice('Judge', 'judge')
                .addChoice('Lawyer', 'lawyer'))
        .addStringOption(option =>
            option.setName('case')
                .setDescription('The case ID')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const role = interaction.options.getString('role');
        const caseId = interaction.options.getString('case');

        // Assign roles and inform the user
        const guild = interaction.guild;
        const member = guild.members.cache.get(user.id);

        let roleName;
        if (role === 'judge') {
            roleName = 'Judge';
        } else if (role === 'lawyer') {
            roleName = 'Lawyer';
        }

        const roleToAdd = guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());

        if (!roleToAdd) {
            await interaction.reply(`Role ${roleName} does not exist.`);
            return;
        }

        if (member.roles.cache.has(roleToAdd.id)) {
            await interaction.reply(`${user.username} is already assigned as ${roleName}.`);
            return;
        }

        await member.roles.add(roleToAdd);

        const embed = new MessageEmbed()
            .setTitle('Role Assigned')
            .setDescription(`${user.username} has been assigned as ${roleName} for case ${caseId}.`)
            .setColor('GREEN');

        await interaction.reply({ embeds: [embed] });
    }
};