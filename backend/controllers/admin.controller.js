const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const adminModel = require("../models/admin.model")
const BorrowRequest = require("../models/borred.books.model");
const UserModel = require("../models/user.model");
const BookModel = require("../models/book.model");





const adminLogin = async (req, res) => {
    const { email, password } = req.body
    try {
        const adminExist = await adminModel.findOne({ email })
        if (adminExist) {
            // const isPasswordCorrect = bcrypt.compareSync(password,adminExist.password)
            const isPasswordCorrect = await adminModel.findOne({ email, password })
            if (isPasswordCorrect) {
                return res.status(200).json({ message: "admin login successfully" })
            }
            return res.status(404).json({ message: "incorrect password" })
        }
        return res.status(404).json({ message: "admin not found" })
    } catch (error) {
        console.log("error while admin login", error)
        return res.status(500).json({ message: "error while admin login" })
    }
}




const getBorrowRequests = async (req, res) => {
    try {
        const requests = await BorrowRequest.find().populate("bookId").populate("userId");
        res.json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching borrow requests" });
    }
};

const approveBorrowRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await BorrowRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        // Add book to user's borrowed list
        await UserModel.findByIdAndUpdate(request.userId, {
            $push: { borrowedBooks: request.bookId }
        });

        // Mark book as unavailable
        await BookModel.findByIdAndUpdate(request.bookId, { is_available: false });

        // Remove request from pending list
        await BorrowRequest.findByIdAndDelete(requestId);

        res.json({ success: true, message: "Request approved!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error approving request" });
    }
};

const rejectBorrowRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        await BorrowRequest.findByIdAndDelete(requestId);
        res.json({ success: true, message: "Request rejected!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error rejecting request" });
    }
};

module.exports = { adminLogin, getBorrowRequests, approveBorrowRequest, rejectBorrowRequest };


