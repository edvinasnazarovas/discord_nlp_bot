require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080; // Use the PORT environment variable provided by Azure, or default to 8080
const path = require('path');
const fs = require("fs");
const { Client, Collection, Events, GatewayIntentBits, REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const translate = require('translate-google');

app.get('/', (req, res) => res.send('Bot is running!'));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.on(Events.InteractionCreate, async interaction => {
    // Existing check for chat input commands
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            // Existing error handling logic
        }
    }
    // Add handling for context menu commands
    else if (interaction.isContextMenuCommand()) {
        // Check if the context menu command is the one for translating messages
        if (interaction.commandName === 'Translate') {
            // Fetching the message that was right-clicked
            const message = await interaction.channel.messages.fetch(interaction.targetId);

            try {
                // Attempting to translate the message content to English
                const userPreferences = JSON.parse(fs.readFileSync(path.join(__dirname, 'user_prefs.json'), 'utf8')).userPreferences;
                const targetLanguage = userPreferences[interaction.user.id] || 'en'; // Default to English if no preference set
                const translation = await translate(message.content, { to: targetLanguage });
                await interaction.reply({ content: `Translation: ${translation}`, ephemeral: true });
            } catch (error) {
                console.error('Translation error:', error);
                await interaction.reply({ content: 'Error translating the message.', ephemeral: true });
            }
        }
    }
});


client.login(token);