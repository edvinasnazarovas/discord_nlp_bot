const { SlashCommandBuilder } = require('discord.js');
const translate = require('translate-google');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tr')
        .setDescription('Translates text')
        // Add options for 'language' and 'text' here
        .addStringOption(option =>
            option.setName('language')
                .setDescription('The target language for translation')
                .setRequired(true)) // Make sure to set as required if necessary
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text to translate')
                .setRequired(true)), // Make sure to set as required if necessary
    async execute(interaction) {
        const targetLanguage = interaction.options.getString('language');
        const textToTranslate = interaction.options.getString('text');

        console.log("interaction", interaction.options)

        try {
            const translation = await translate(textToTranslate, { to: targetLanguage });
            await interaction.reply({ content: `Translation (${targetLanguage}): ${translation}`, ephemeral: true });
        } catch (error) {
            console.error('Translation error:', error);
            await interaction.reply({ content: 'Error translating the message.', ephemeral: true });
        }
    },
};
