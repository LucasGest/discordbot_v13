const { Client } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  execute(Client) {
    console.log(`Ready! Connecté en tant que ${Client.user.username}`);
    Client.user.setActivity("prefix : -", {
      type: "STREAMING",
      url: "https://www.twitch.tv/lucanemone",
    });
  },
};
