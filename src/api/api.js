const { fortuneStore } = require("../database/fortuneStore")
const { getLoginCookies } = require("./login")

module.exports.login = async (username, password, discordId) => {
    // Check to see if a user already exists
    {
        let { payload } = await fortuneStore.find('user', null, { match: { discordId } })
        var userExists = payload.count != 0
    }

    // Create the user if it doesn't already exist
    if (!userExists) {
        await fortuneStore.create('user', [{
            discordId,
            fimfictionUsername: username,
            cookies: null
        }])
    }

    // Get the userId
    {
        let { payload } = await fortuneStore.find('user', null, { match: { discordId } })
        var userId = payload.records[0].id
    }

    // Get login cookies
    const { cookies, success } = await getLoginCookies(username, password)

    // If we successfully logged in, update the user with the cookies
    if (success) {
        await fortuneStore.update('user', { id: userId, replace: { cookies } })
    }
    return success
}

module.exports.logout = async (discordId) => {
    const { payload } = await fortuneStore.find('user', null, { match: { discordId } })
    const userExists = payload.count != 0

    if (userExists) {
        const userId = payload.records[0].id
        await fortuneStore.update('user', { id: userId, replace: { cookies: null } })
    }
    return userExists
}

module.exports.logStatus = async (discordId) => {
    const { payload } = await fortuneStore.find('user', null, { match: { discordId } })
    const userExists = payload.count != 0

    let loggedIn = false
    let fimfictionUsername = ""

    if (userExists) {
        const user = payload.records[0]
        loggedIn = user.cookies != null
        fimfictionUsername = user.fimfictionUsername
    }

    return { loggedIn, fimfictionUsername }
}