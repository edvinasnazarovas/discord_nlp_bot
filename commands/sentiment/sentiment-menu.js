const Sentiment = require('sentiment');
const sentiment = new Sentiment();

module.exports = {
    data: {
        name: 'Analyze Sentiment', // Name of the context menu item
        type: 3, // Type 3 indicates a message context menu
    },
    async execute(interaction) {
        // Fetching the message that was right-clicked
        const message = await interaction.channel.messages.fetch(interaction.targetId);

        try {
            // Performing sentiment analysis on the message content
            const result = sentiment.analyze(message.content);
            let sentimentScore = result.score;
            let sentimentAnalysis;

            // Determining the sentiment based on the score
            if (sentimentScore > 0) {
                sentimentAnalysis = 'Positive 😊';
            } else if (sentimentScore < 0) {
                sentimentAnalysis = 'Negative 😞';
            } else {
                sentimentAnalysis = 'Neutral 😐';
            }

            // Replying with the sentiment analysis result
            await interaction.reply({ content: `Sentiment Analysis: ${sentimentAnalysis} (Score: ${sentimentScore})`, ephemeral: true });
        } catch (error) {
            console.error('Sentiment analysis error:', error);
            await interaction.reply({ content: 'Error analyzing the sentiment of the message.', ephemeral: true });
        }
    },
};
