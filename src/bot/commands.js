const { Command, CommandOptionType } = require('../command-doer/commandDoer')
const { ping, login, logout, logStatus } = require('./actions')

module.exports.hello = new Command('hello', "Say hello!", ping)

module.exports.userCommand = new Command('user', "Commands for users")
    .addSubCommand('login', "Login on Fimfiction", login, subCommand => {
        subCommand.addOption('username', "Your Fimfiction username", CommandOptionType.STRING, true)
        subCommand.addOption('password', "Your Fimfiction password", CommandOptionType.STRING, true)
    })
    .addSubCommand('logout', "Logout on Fimfiction", logout)
    .addSubCommand('status', "Check whether you're currently logged in on Fimfiction", logStatus)

module.exports.bookClubCommand = new Command('bookclub', "Commands for bookclub")
    .addSubCommand('sync', "Syncs completed chapters to and from Fimfiction and the bot", ping)
    .addSubCommand('list', "Lists all of the bookclubs you're a member of", ping)
    .addSubCommand('view', "View a bookclub", ping, subCommand => {
        subCommand.addOption('name', "The name of the bookclub", CommandOptionType.STRING, true, option => {
            option.addChoice("Austraeoh")
            option.addChoice("Eljunbyro")
            option.addChoice("Innavedr")
        })
    })
    .addSubCommand('create', "Make a new bookclub", ping, subCommand => {
        subCommand.addOption('url', "The fic's url", CommandOptionType.STRING, true)
        subCommand.addOption('name', "The name of the bookclub, the fic's title will be used if left blank", CommandOptionType.STRING, false)
    })
    .addSubCommand('delete', "Delete an existing bookclub", ping, subCommand => {
        subCommand.addOption('name', "The name of the bookclub", CommandOptionType.STRING, true, option => {
            option.addChoice("Austraeoh")
            option.addChoice("Eljunbyro")
            option.addChoice("Innavedr")
        })
        subCommand.addOption('verify', "Type the name of the bookclub you wish to delete, just to make sure", CommandOptionType.STRING, true)
    })
    .addSubCommand('invite', "Add a user to an existing bookclub", ping, subCommand => {
        subCommand.addOption('name', "The name of the bookclub", CommandOptionType.STRING, true, option => {
            option.addChoice("Austraeoh")
            option.addChoice("Eljunbyro")
            option.addChoice("Innavedr")
        })
        subCommand.addOption('user', "The user you want to invite", CommandOptionType.USER, true)
    })