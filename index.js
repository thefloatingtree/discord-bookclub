require('dotenv').config()
const { Bot } = require('./src/bot/bot')

new Bot({ dev: true, guildId: process.env.GUILD_ID }).start(process.env.TOKEN)

// user status
// -> user is logged in / user is not logged in
// user login [username (string)] [password (string)]
// -> user successfully logged in / vice versa
// user logout
// -> user successfully logged out
// bookclub sync
// -> You're not logged in!
// -> Successfullly synced
// bookclub list
// -> List all of the bookclubs you are a part of
// bookclub view [book title (string choice)]
// 
// bookclub start [book url (string)]
// 
// bookclub end [book title (string choice)] [book title (string)]
// 
// bookclub add [book title (string choice)] [user (user)]
// 