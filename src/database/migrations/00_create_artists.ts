import Knex from 'knex'

export async function up (knex: Knex) {
  return knex.schema.createTable('artists', table => {
    table.string('artistSpotifyId').primary()
    table.string('name').notNullable()
  })
}

export async function down (knex: Knex) {
  return knex.schema.dropTable('artists')
}
