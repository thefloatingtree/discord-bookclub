async function applicationCommandManager(client) {
    return client.application.commands
}

async function guildCommandManager(client, guildId) {
    return await client.guilds.cache.get(guildId).commands
}

async function deleteAllCommands(commandManager) {
    const commandsData = await commandManager.fetch()
    commandsData.forEach(async command => {
        await commandManager.delete(command.id)
    })
}

async function addCommand(commandManager, command) {
    await commandManager.create(command)
}

function buildOptions(rawOptions) {
    if (!rawOptions) return {}
    const output = {}
    rawOptions.forEach(rawOption => {
        output[rawOption.name] = rawOption.value
    })
    return output
}

const CommandOptionType = {
    SUB_COMMAND: 1,
    SUB_COMMAND_GROUP: 2,
    STRING: 3,
    INTEGER: 4,
    BOOLEAN: 5,
    USER: 6,
    CHANNEL: 7,
    ROLE: 8,
    MENTIONABLE: 9
}

class CommandDoer {
    constructor() {
        this.subCommands = new Map()
        this.commands = []
    }

    async go(client, guildId = null) {
        const commandManager = guildId ? await guildCommandManager(client, guildId) : await applicationCommandManager(client)
        await deleteAllCommands(commandManager)
        this.commands.forEach(async command => {
            await addCommand(commandManager, command)
        })
    }

    addCommand(command) {
        this.commands.push(command)
        const firstLevelSubCommands = command.options
            .filter(option => option.type === CommandOptionType.SUB_COMMAND)
        const secondLevelSubCommands = command.options
            .filter(option => option.type === CommandOptionType.SUB_COMMAND_GROUP)
            .map(commandGroup => commandGroup.options)
            .flat()
        const subCommands = [...firstLevelSubCommands, ...secondLevelSubCommands]

        if (subCommands.length) {
            subCommands.forEach(subCommand => {
                this.subCommands.set(subCommand.subCommandName, subCommand)
            })
        } else {
            this.subCommands.set(command.name, command)
        }
    }

    async resolveInteraction(interaction) {
        const subCommands = interaction.options.filter(option => option.type === 'SUB_COMMAND')
        const commandGroups = interaction.options.filter(option => option.type === 'SUB_COMMAND_GROUP')

        if (subCommands.length) {
            subCommands.forEach(async subCommand => {
                await this.subCommands
                    .get(interaction.commandName + subCommand.name)
                    .callback(interaction, buildOptions(subCommand.options))
            })
        } else if (commandGroups.length) {
            commandGroups.forEach(async commandGroup => {
                commandGroup.options.forEach(async subCommand => {
                    await this.subCommands
                        .get(interaction.commandName + commandGroup.name + subCommand.name)
                        .callback(interaction, buildOptions(subCommand.options))
                })
            })
        } else {
            await this.subCommands
                .get(interaction.commandName)
                .callback(interaction, buildOptions(interaction.options))
        }
    }
}

class Command {
    constructor(name, description, callback) {
        this.callback = callback

        this.name = name
        this.description = description
        this.options = []
    }

    addGroup(name, description, addSubCommands = group => { }) {
        const commandGroup = new CommandGroup(name, description, this.name)
        addSubCommands(commandGroup)
        this.options.push(commandGroup)
        return this
    }

    addOption(name, description, type, required = false, addChoices = option => { }) {
        const commandField = new CommandOption(name, description, type, required)
        addChoices(commandField)
        this.options.push(commandField)
        return this
    }

    addSubCommand(name, description, callback, addOption = subCommand => { }) {
        const subCommand = new SubCommand(name, description, callback, this.name)
        addOption(subCommand)
        this.options.push(subCommand)
        return this
    }
}

class CommandGroup {
    constructor(name, description, parentName) {
        this.parentName = parentName
        this.name = name
        this.description = description
        this.type = CommandOptionType.SUB_COMMAND_GROUP
        this.options = []
    }

    addSubCommand(name, description, callback, addOption = subCommand => { }) {
        const subCommand = new SubCommand(name, description, callback, this.parentName + this.name)
        addOption(subCommand)
        this.options.push(subCommand)
        return this
    }
}

class SubCommand {
    constructor(name, description, callback, parentName) {
        this.callback = callback
        this.subCommandName = parentName + name

        this.name = name
        this.description = description
        this.type = CommandOptionType.SUB_COMMAND
        this.options = []
    }

    addOption(name, description, type, required = false, addChoices = option => { }) {
        const commandField = new CommandOption(name, description, type, required)
        addChoices(commandField)
        this.options.push(commandField)
        return this
    }
}

class CommandOption {
    constructor(name, description, type, required) {
        this.name = name
        this.description = description
        this.type = type
        this.required = required
        this.choices = []
    }

    addChoice(name, value = null) {
        value = value ? value : name
        this.choices.push({
            name,
            value
        })
    }
}

module.exports = { CommandOptionType, CommandDoer, Command, CommandGroup, SubCommand, CommandOption }