const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
  try {
    const requestedIsbn = req.params.isbn; // Retrieve ISBN from request parameters
    const book = books[requestedIsbn];
    if (book) {
      res.json(book); // Send the book details as a JSON response
    } else {
      res.status(404).json({ message: "Book not found" }); // Handle book not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" }); // Handle unexpected errors
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    try {
    const requestedAuthor = req.params.author; // Retrieve author from request parameters
    const matchingBooks = [];

    // Get all book keys
    const bookKeys = Object.keys(books);

    // Iterate through books and find matches
    for (const key of bookKeys) {
      const book = books[key];
      if (book.author === requestedAuthor) {
        matchingBooks.push(book);
      }
    }

    if (matchingBooks.length > 0) {
      res.json(matchingBooks); // Send matching books as a JSON response
    } else {
      res.status(404).json({ message: "No books found by that author" }); // Handle no books found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving books" }); // Handle unexpected errors
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  try {
    const requestedTitle = req.params.title; // Retrieve title from request parameters
    const matchingBooks = [];

    // Get all book keys
    const bookKeys = Object.keys(books);

    // Iterate through books and find matches
    for (const key of bookKeys) {
      const book = books[key];
      if (book.title.toLowerCase() === requestedTitle.toLowerCase()) { // Case-insensitive comparison
        matchingBooks.push(book);
      }
    }

    if (matchingBooks.length > 0) {
      res.json(matchingBooks); // Send matching books as a JSON response
    } else {
      res.status(404).json({ message: "No books found with that title" }); // Handle no books found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving books" }); // Handle unexpected errors
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  try {
    const requestedIsbn = req.params.isbn; // Retrieve ISBN from request parameters
    const book = books[requestedIsbn];

    if (book) {
      const reviews = book.reviews;
      res.json(reviews); // Send the book reviews as a JSON response
    } else {
      res.status(404).json({ message: "Book not found" }); // Handle book not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving reviews" }); // Handle unexpected errors
  }
});

//Task-10 
public_users.get('/promise', function (req, res) {
    try {
      getBookListWithPromise('http://localhost:5000/') 
        .then(bookList => {
          res.json(bookList);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: "Error retrieving book list" });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Unexpected error" });
    }
});

// Task-11
public_users.get('/promise/isbn/:isbn', function (req, res) {
    try {
      const requestedIsbn = req.params.isbn;
      getBookListWithPromise("http://localhost:5000/isbn/" + requestedIsbn) 
        .then(book => {
          res.json(book);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: "Error retrieving book details" });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Unexpected error" });
    }
});
 
// Task-12
public_users.get('/promise/author/:author', function (req, res) {
    try {
      const requestedAuthor = req.params.author;
      getBookListWithPromise("http://localhost:5000/author/" + requestedAuthor) 
        .then(book => {
          res.json(book);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: "Error retrieving book details" });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Unexpected error" });
    }
});
  
// Task-13 
public_users.get('/promise/title/:title', function (req, res) {
    try {
      const requestedTitle = req.params.title;
      getBookListWithPromise("http://localhost:5000/title/" + requestedTitle) 
        .then(book => {
          res.json(book);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: "Error retrieving book details" });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Unexpected error" });
    }
});  

module.exports.general = public_users;
