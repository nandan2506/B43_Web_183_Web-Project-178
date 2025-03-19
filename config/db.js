require("dotenv").config()
const mongoose = require("mongoose")

const db_url= process.env.MONGODB_URL
const connecton= mongoose.connect(db_url)
module.exports={connecton}