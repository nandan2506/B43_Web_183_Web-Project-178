const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    adminname:{type:String,require:true},
    email:{type:String,require:true,unique:true},
    password:{type:String,require:true,unique:true}
})


const adminModel = mongoose.model("admin",adminSchema)
module.exports=adminModel