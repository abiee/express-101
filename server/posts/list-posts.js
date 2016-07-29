'use-strict';

const PAGE_SIZE = 5;

module.exports = (database, page, callback) => {
  var offset = ((page - 1) * PAGE_SIZE) + 1;

  database.collection('posts')
    .find()
    .skip(offset)
    .limit(PAGE_SIZE)
    .toArray(callback);
};
