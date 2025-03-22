const bcrypt = require("bcryptjs")
const userModel = require("../models/user.model")
const BorrowedBookModel = require("../models/borred.books.model");
const jwt = require("jsonwebtoken")

const allUsers = async (req, res) => {
    try {
        const users = await userModel.find()
        if (!users.length) {
            return res.status(200).json({ message: "No users found", data: [] })
        }

        res.status(200).json({ message: "Users retrieved successfully", data: users })
    } catch (error) {
        console.log("error while fetching users", error)
        res.status(404).json("error while fetching users")
    }
}



const userRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const userExist = await userModel.findOne({ email })
        if (userExist) {
            return res.status(400).json({ message: "user already exist, please login" })
        }
        const hash = bcrypt.hashSync(password, 10)
        await userModel.create({ username, email, password: hash })
        res.status(201).json({ message: "user register successfully" })

    } catch (error) {
        res.status(500).json({ message: "error while registration" })
        console.log("error while registration", error)
    }
}


const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const userExist = await userModel.findOne({ email: email })
        if (userExist) {
            const isPasswordCorrect = bcrypt.compareSync(password, userExist.password)

            if (isPasswordCorrect) {
                const tkn = jwt.sign({ userInfo: userExist }, "user_token")
                return res.status(200).json({ message: "user login successfully", tkn,userExist })
            }
        }

        return res.status(404).json({ message: "user not found, please register " })

    } catch (error) {
        res.status(404).json({ message: "error while login" })
        console.log("error while login", error)
    }
}



const borrowBook = async (req, res) => {
    try {
        const { bookId, dueDate } = req.body;
        const userId = req.user._id; // Get userId from JWT

        const newBorrow = new BorrowedBookModel({ userId, bookId, dueDate });
        await newBorrow.save();

        res.status(201).json({ success: true, message: "Book borrowed successfully" });
    } catch (error) {
        console.error("Error borrowing book:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};






const getBorrowedBooks = async (req, res) => {
    try {
        const userId = req.user.id; // Get userId from JWT

        // Fetch user and populate borrowed books
        const user = await UserModel.findById(userId).populate("borrowedBooks");

        res.json({ success: true, borrowedBooks: user.borrowedBooks });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching borrowed books" });
    }
};




module.exports = { userRegister, userLogin, allUsers ,borrowBook,getBorrowedBooks}