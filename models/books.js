const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {type: String, required: true},
  commentcount: {type: Number},
  comments: [{type: String, required: false}]
});

function set_commentcount(book) {
  book.set("commentcount", book.comments.length)
  return book
}

bookSchema.post(/^find/, function (res, next) {
  if (Array.isArray(res))
      res = res.map((book) => set_commentcount(book))
  else
      res = set_commentcount(res)
  next()
})

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;