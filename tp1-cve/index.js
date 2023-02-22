const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        port: 3306,
        user: 'knex',
        password: 'knex',
        database: 'knex',
        charset: 'utf8'
    }
})

knex.schema.hasTable('users').then((exists) => {
    if (!exists) {
        knex.schema.createTable('users', (table) => {
            table.increments('id').primary()
            table.string('name').notNullable()
            table.string('secret').notNullable()
        }).then()
        knex('users').insert({
            name: 'admin',
            secret: 'super confidentiel'
        }).then()
        knex('users').insert({
            name: 'guest',
            secret: 'salut'
        }).then()
    }
})

knex('users')
    .select()
    .where({ secret: { 'name': 'admin' } })
    .then((userSecret) => console.log(userSecret))