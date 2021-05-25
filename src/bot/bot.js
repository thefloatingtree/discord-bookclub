const { Client, Intents, MessageEmbed } = require('discord.js')
const { CommandDoer, Command, CommandOptionType, SubCommand } = require('../command-doer/commandDoer')
const { ping } = require('./actions')
const { hello, userCommand, bookClubCommand } = require('./commands')

class Bot {
    constructor({ dev = false, guildId } = {}) {
        this.dev = dev 
        this.guildId = guildId

        const intents = new Intents().add('GUILDS', 'GUILD_MESSAGES')
        this.client = new Client({ intents })
        this.commandDoer = new CommandDoer()

        this.client.once('ready', this.onReady.bind(this))
        this.client.on('interaction', this.onInteraction.bind(this))
    }

    async onReady() {
        this.commandDoer.addCommand(hello)
        this.commandDoer.addCommand(userCommand)
        this.commandDoer.addCommand(bookClubCommand)

        if (this.dev) {
            await this.commandDoer.go(this.client, this.guildId)
        } else {
            await this.commandDoer.go(this.client)
        }

        console.log(this.client.user.username + " is ready!")
    }

    async onInteraction(interaction) {
        if (interaction.isCommand()) await this.commandDoer.resolveInteraction(interaction)
    }

    start(botToken) {
        this.client.login(process.env.TOKEN)
    }
}

module.exports = { Bot }