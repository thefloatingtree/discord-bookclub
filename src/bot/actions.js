const { login, logout, logStatus } = require("../api/api")

module.exports.ping = (interaction) => {
    interaction.reply('Hi!')
}

module.exports.login = async (interaction, { username, password }) => {
    interaction.reply(`Logging ${username} in...`)
    const success = await login(username, password, interaction.user.id)
    interaction.editReply(success ? `Logged ${username} in successfully` : `Couldn't log ${username} in. Check your credentials`)
}

module.exports.logout = async (interaction) => {
    interaction.reply(`Logging you out...`)
    const success = await logout(interaction.user.id)
    interaction.editReply(success ? `Logged out successfully` : `Couldn't log out`)
}

module.exports.logStatus = async (interaction) => {
    interaction.reply(`Checking your user status...`)
    const { loggedIn, fimfictionUsername } = await logStatus(interaction.user.id)
    interaction.editReply(loggedIn ? `You are logged in as ${fimfictionUsername}` : `You are not logged in`)
}