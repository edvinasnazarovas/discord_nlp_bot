const translate = require('translate-google');
const fs = require("fs");
const path = require('path');

module.exports = {
    data: {
        name: 'Translate', // Name of the context menu item
        type: 3, // Type 3 indicates a message context menu
    },
    async execute(interaction) {
        const message = await interaction.channel.messages.fetch(interaction.targetId);
        try {
            const userPreferences = JSON.parse(fs.readFileSync(path.join(__dirname, '../../user_prefs.json'), 'utf8')).userPreferences;
            const targetLanguage = userPreferences[interaction.user.id] || 'en';
            const translation = await translate(message.content, { to: targetLanguage });
            await interaction.reply({ content: `Translation: ${translation}`, ephemeral: true });
        } catch (error) {
            console.error('Translation error:', error);
            await interaction.reply({ content: 'Error translating the message.', ephemeral: true });
        }
    },
};
