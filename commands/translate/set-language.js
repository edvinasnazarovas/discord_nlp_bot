const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlang')
        .setDescription('Sets your preferred language for translations.')
        .addStringOption(option =>
            option.setName('language')
                .setDescription('Your preferred language code (e.g., en, es, fr)')
                .setRequired(true)),
    async execute(interaction) {
        const languageCode = interaction.options.getString('language');
        // Assuming you have a function to validate the language code
        /*if (!isValidLanguageCode(languageCode)) {
            await interaction.reply({ content: 'Invalid language code provided.', ephemeral: true });
            return;
        }*/

        const preferencesPath = path.join(__dirname, '../../user_prefs.json');
        const preferences = JSON.parse(fs.readFileSync(preferencesPath, 'utf8'));

        preferences.userPreferences[interaction.user.id] = languageCode;
        fs.writeFileSync(preferencesPath, JSON.stringify(preferences, null, 2));

        await interaction.reply({ content: `Your preferred language has been set to ${languageCode}.`, ephemeral: true });
    },
};
