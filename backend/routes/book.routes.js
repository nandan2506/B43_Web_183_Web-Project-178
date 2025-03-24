const { allBooks, deleteBook, addBook, borrowBook } = require("../controllers/book.controller")
const express = require("express")
const router = express.Router()
const authentication = require("../middlewares/authentication");


router.post("/borrow/:bookId", authentication, borrowBook);
router.get("/all", allBooks);
router.post("/add", addBook);
router.post("/delete/:bookId", deleteBook);

module.exports = router





