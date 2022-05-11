const Discord = require("discord.js");
const { Collection, Intents } = require("discord.js");
const dotenv = require("dotenv");
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const Client = new Discord.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
dotenv.config();
const clientId = "970745522753253486";
const guildId = "785874166892593233";
Client.commands = new Collection();

const commands = [];
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    Client.once(event.name, (...args) => event.execute(...args));
  } else {
    Client.on(event.name, (...args) => event.execute(...args));
  }
}

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  Client.commands.set(command.data.name, command);
}

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Lancement du rafraichissement des (/) commandes.");

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log("Rafraichissement réussis des (/) commandes.");
  } catch (error) {
    console.error(error);
  }
})();

Client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = Client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

// Client.on("messageCreate", async (message) => {});

Client.login(process.env.TOKEN);
