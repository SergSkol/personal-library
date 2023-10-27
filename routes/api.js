/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require("../models/books");

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let books;
      try {
        books = await Book.find();
        res.send(books);
      } catch (err) {
        res.send(err);
      }
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        res.send("missing required field title");
      } else {
        let newBook = new Book({
          title: title,
          commentcount: 0,
        });
        let book = await newBook.save();
        res.send(book);
      }
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      try {
        await Book.deleteMany({});
        res.send("complete delete successful");
      } catch (err) {
        res.send("could not delete all books");
      }
    });

  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const book = await Book.findOne({_id: bookid});
        res.send(book);
      } catch (err) {
        res.send('no book exists');
      }
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if (!comment)
        return res.send("missing required field comment")
      else
        try {
          let book = await Book.findByIdAndUpdate(
            {_id: bookid}, 
            { $push: { comments: comment } }, 
            { returnDocument: "after" });
          res.send(book)
        } catch {
          res.send("no book exists")
        }

    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        await Book.findOneAndDelete({_id: bookid});
        res.send("delete successful");
      } catch (err) {
        res.send("no book exists");
      }

    });
  
};
