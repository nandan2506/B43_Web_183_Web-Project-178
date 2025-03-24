const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password : {type: String,require:true},
    borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]

});

const userModel = mongoose.model("User", userSchema); 
module.exports = userModel;
