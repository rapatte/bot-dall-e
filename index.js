require('dotenv/config');
const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const prefix = '!img ';

// Configuration des options du bot
const options = {
  http: {
    version: 7,
    api: 'https://discord.com/api',
    retries: 5,
    delayBetweenRetries: 10000,
    timeOffset: 5000,
  }, intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
};

const client = new Client(options)

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
})
const openai = new OpenAIApi(configuration);


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== process.env.CHANNEL_ID) return;
  if (!message.content.startsWith(prefix)) return;

  // Récupérer la commande et les arguments
  try {
    const response = await openai.createImage({
      model: "dall-e-3",
      prompt: message.content.slice(5),
      n: 1,
      size: "1024x1024",
    });
    image_url = response.data.data[0].url;

    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('DALL-E 3.0')
      .setURL('https://openai.com/dall-e-3')
      .setAuthor({ name: message.author.globalName, iconURL: message.author.displayAvatarURL({ format: 'png', dynamic: true})})
      .addFields({ name: 'Tu me demandes :', value: message.content.slice(5), inline: true })
      .setImage(image_url)
      .setTimestamp()

    message.channel.send({ embeds: [exampleEmbed] });
  } catch (error) {
    console.error(error)
    message.channel.send('Erreur, voir logs')
  }

});

client.login(process.env.TOKEN);
