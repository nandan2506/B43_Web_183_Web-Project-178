const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    publication_year: { type: Number, required: true },
    genre: { type: [String], required: true }, // Array of strings
    description: { type: String, required: true },
    cover_image: { type: String, required: true }, // Store image URL
    is_available: {type:Boolean,default: true},
    borred_by:[{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
});

// Correct model creation
const bookModel = mongoose.model("books", bookSchema);

module.exports = bookModel;
