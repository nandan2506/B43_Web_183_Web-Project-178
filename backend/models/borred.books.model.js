const mongoose = require("mongoose");

const borrowedBookSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    borrowedAt: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returned: { type: Boolean, default: false }
});

const borredBookModel = mongoose.model("BorrowedBook", borrowedBookSchema)
module.exports = borredBookModel;
