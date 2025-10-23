class UsersMongoRepository {
  constructor(db) {
    this.col = db.collection('users');
  }

  async findById(id) {
    return this.col.findOne({ _id: id });
  }
}

module.exports = { UsersMongoRepository };

