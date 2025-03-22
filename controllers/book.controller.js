const bookModel = require("../models/book.model");
const userModel = require("../models/user.model");
const UserModel = require("../models/user.model");

const allBooks = async (req, res) => {
    try {
        const books = await bookModel.find(); // Correct method
        res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Error fetching books" });
    }
}

const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBook = await bookModel.findByIdAndDelete(id);

        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting book", error });
    }
}


const addBook = async (req, res) => {
    try {
        const { title, author, publication_year, genre, description, cover_image, is_available } = req.body;
        const book_present = await bookModel.findOne({ title, author });

        if (book_present) {
            return res.status(400).json({ message: "Book already present" });
        }
        await bookModel.create({ title, author, publication_year, genre, description, cover_image, is_available })
        res.status(202).json({ message: "Book added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error while adding book", error });
    }
}






const borrowBook = async (req, res) => {
    try {
        const userId = req.user._id;  // Get user ID from the JWT token
        const bookId = req.params.bookId; // Get book ID from request

        // Find the book
        const book = await bookModel.findById(bookId);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        // Update the user's borrowed books list
        const user = await userModel.findByIdAndUpdate(
            userId,
            { $push: { borrowedBooks: bookId } },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Book borrowed successfully", user });
    } catch (error) {
        console.error("Error borrowing book:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};






const returnBook = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookId } = req.params;

        // Remove book from user's borrowedBooks
        await UserModel.findByIdAndUpdate(userId, {
            $pull: { borrowedBooks: bookId }
        });

        // Mark book as available
        await bookModel.findByIdAndUpdate(bookId, { is_available: true });

        res.json({ success: true, message: "Book returned successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error returning book" });
    }
};





module.exports = {allBooks,addBook,deleteBook,borrowBook,returnBook}