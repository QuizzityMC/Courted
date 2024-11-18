const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sue')
    .setDescription('Sue someone in the server')
    .addUserOption(option => option.setName('user').setDescription('The user to sue').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for suing').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    const courtCategory = interaction.guild.channels.cache.find(c => c.name === 'Court Cases' && c.type === 4);
    if (!courtCategory) {
      await interaction.reply('The "Court Cases" category does not exist. Please create it.');
      return;
    }

    const courtChannel = await interaction.guild.channels.create({
      name: `case-${interaction.user.username}-vs-${user.username}`,
      type: 0,
      parent: courtCategory.id
    });

    const thread = await courtChannel.threads.create({
      name: `${interaction.user.username}-vs-${user.username}`,
      autoArchiveDuration: 1440,
      reason: 'Court case thread'
    });

    await thread.send(`${interaction.user} is suing ${user} for "${reason}"`);

    await interaction.reply(`You have sued ${user} for "${reason}". A court case has been created.`);
  },
};
