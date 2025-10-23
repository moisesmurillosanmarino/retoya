class CourtsSqlRepository {
  constructor(knex) {
    this.knex = knex;
  }

  async list() {
    return this.knex('courts').select('*').orderBy('id', 'asc');
  }
}

module.exports = { CourtsSqlRepository };

