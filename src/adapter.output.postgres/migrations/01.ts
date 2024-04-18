// Written by Ingo Schmidt, in 2024.

import { Knex } from 'knex'

export const up = async (db: Knex) => {
  await db.schema.createTable('devices', (table) => {
    table.enum('genus', ['router', 'switch'])
    table.enum('species', ['core', 'edge', 'l3'])
    table.string('id').primary()
    table.string('desc').notNullable()
    table.string('ip').notNullable()
    table.float('lat').notNullable()
    table.float('lon').notNullable()
    table.smallint('n_ports').notNullable()
  })
  await db.schema.createTable('links', (table) => {
    table.string('parent')
    table.string('child')
    table.foreign('parent').references('id').inTable('devices').onDelete('CASCADE')
    table.foreign('child').references('id').inTable('devices').onDelete('CASCADE')
  })
  await db.schema.createTable('networks', (table) => {
    table.string('sw_id')
    table.string('name')
    table.string('ip')
    table.smallint('cidr')
    table.foreign('sw_id').references('id').inTable('devices')
  })
}

export const down = async (db: Knex) => {
  await db.schema.dropTable('devices')
  await db.schema.dropTable('links')
  await db.schema.dropTable('networks')
}

// EOF
