const express = require("express")
const bcrypt = require("bcryptjs")
const adminModel = require("../models/admin.model")
// const { json } = require("body-parser")
const adminRouts = express.Router()

const adminLogin = async(req,res)=>{
    const {email,password}=req.body
    try {
        const adminExist = await adminModel.findOne({email})
        if(adminExist){
            // const isPasswordCorrect = bcrypt.compareSync(password,adminExist.password)
            const isPasswordCorrect = await adminModel.findOne({email,password})
            if(isPasswordCorrect){
                return res.status(200).json({message:"admin login successfully"})
            }
            return res.status(404).json({message:"incorrect password"})
        }
        return res.status(404).json({message:"admin not found"})
    } catch (error) {
        console.log("error while admin login",error)
        return res.status(500).json({message:"error while admin login"})
    }
}


module.exports= {adminLogin}