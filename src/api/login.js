const puppeteer = require('puppeteer')

module.exports.getLoginCookies = async (username, password) => {
    const usernameSelector = 'body > div.body-layout > div.body_container > div:nth-child(4) > div.content > div > div.left.tab-content.tab-content-selected > div > div > div > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > input[type=text]'
    const passwordSelector = 'body > div.body-layout > div.body_container > div:nth-child(4) > div.content > div > div.left.tab-content.tab-content-selected > div > div > div > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type=password]'
    const loginSelector = 'body > div.body-layout > div.body_container > div:nth-child(4) > div.content > div > div.left.tab-content.tab-content-selected > div > div > div > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > button'

    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto('https://www.fimfiction.net/login')

    await page.waitForSelector(usernameSelector)
    await page.type(usernameSelector, username)

    await page.waitForSelector(passwordSelector)
    await page.type(passwordSelector, password)

    await page.waitForSelector(loginSelector)
    await page.click(loginSelector)

    let success = true
    try {
        await page.waitForNavigation({ timeout: 5000 })
    } catch (e) {
        success = false
    }

    const cookies = await page.cookies()

    await browser.close()

    return { cookies, success }
}

module.exports.goToPageWithCookies = async (url, cookies) => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.setCookie(...cookies)

    await page.goto(url)

    return { page, browser }
}