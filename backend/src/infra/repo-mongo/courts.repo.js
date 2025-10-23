class CourtsMongoRepository {
  constructor(db) {
    this.col = db.collection('courts');
  }

  async list() {
    return this.col.find({}).toArray();
  }
}

module.exports = { CourtsMongoRepository };

