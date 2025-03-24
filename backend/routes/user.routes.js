const authentication = require("../middlewares/authentication")
const express = require("express");
const { userRegister, userLogin, allUsers, borrowBook, getBorrowedBooks } = require("../controllers/user.controller");
const router = express.Router();

// Define routes
router.get("/all", allUsers);
router.post("/register", userRegister);
router.post("/login", userLogin);

// router.post("/borrow", authentication, borrowBook);
router.get("/borrowed-books", authentication, getBorrowedBooks);

module.exports = router





