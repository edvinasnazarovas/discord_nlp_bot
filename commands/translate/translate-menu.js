const translate = require('translate-google');

module.exports = {
    data: {
        name: 'Translate', // Name of the context menu item
        type: 3, // Type 3 indicates a message context menu
    },
    async execute(interaction) {
        // Fetching the message that was right-clicked
        const message = await interaction.channel.messages.fetch(interaction.targetId);

        try {
            // Attempting to translate the message content to English
            const translation = await translate(message.content, { to: 'en' });
            await interaction.reply({ content: `Translation: ${translation}`, ephemeral: true });
        } catch (error) {
            console.error('Translation error:', error);
            await interaction.reply({ content: 'Error translating the message.', ephemeral: true });
        }
    },
};
