// Example SQL repository implementation using Knex (placeholder)
class UsersSqlRepository {
  constructor(knex) {
    this.knex = knex;
  }

  async findById(id) {
    return this.knex('users').where({ id }).first();
  }
}

module.exports = { UsersSqlRepository };

