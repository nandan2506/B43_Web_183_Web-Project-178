const express = require("express")
const bcrypt = require("bcryptjs")
const userModel = require("../models/user.model")
const jwt =  require("jsonwebtoken")
const userRouts = express.Router()



const userRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const userExist = await userModel.findOne({ email })
        if (userExist) {
            return res.status(400).json({ message: "user already exist, please login" })
        }
        const hash = bcrypt.hashSync(password, 10)
        await userModel.create({ username, email, password: hash })
        res.status(200).json({ message: "user register successfully" })

    } catch (error) {
        res.status(500).json({ message: "error while registration" })
        console.log("error while registration", error)
    }
}


const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const userExist = await userModel.findOne({ email: email })
        const isPasswordCorrect = bcrypt.compareSync(password, userExist.password)

        if (isPasswordCorrect) {
            const tkn = jwt.sign({userInfo:userExist},"user_token")
            return res.status(200).json({ message: "user login successfully" , tkn})
        }
        return res.status(404).json({ message: "user not found, please register " })

    } catch (error) {
        res.status(404).json({ message: "error while login" })
        console.log("error while login", error)
    }
}

module.exports = { userRegister, userLogin }