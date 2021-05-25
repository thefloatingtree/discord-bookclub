const fortune = require('fortune')
const postgresAdapter = require('fortune-postgres')
const { Pool } = require('pg');
const { models } = require('./models')


const devPGUser = 'postgres'
const devPGHost = 'localhost'
const devPGDatabase = 'discordbookclubdev'
const devPGPassword = 'oatmeal'
const devPGPort = 5432

const pool = process.env.NODE_ENV === 'production' ?
    new Pool({ connectionString: process.env.DATABASE_URL }) :
    new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'discordbookclubdev',
        password: 'oatmeal',
        port: 5432,
    })

const fortuneAdapter = {
    adapter: [
        postgresAdapter,
        { pool }
    ]
}

module.exports.fortuneStore = process.env.USE_POSTGRES_DATABASE === 'true' ? fortune(models, fortuneAdapter) : fortune(models)