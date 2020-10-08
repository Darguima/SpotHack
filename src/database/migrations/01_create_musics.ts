import { table } from 'console'
import Knex from 'knex'

export async function up (knex:Knex) {
  return knex.schema.createTable('musics', table => {
    table.string('musicSpotifyId').primary()
    table.string('name').notNullable()

    table.json('artists').notNullable()

    table.string('youtubeUrl').notNullable()
  })
}

export async function down (knex:Knex) {
  return knex.schema.dropTable('musics')
}
