const express = require("express")
const http = require("http")
const app = express()
const { userLogin, userRegister } = require("./routs/user.routs")
const { adminLogin } = require("./routs/admin.rout")
const { connection } = require("./config/db")
const { Server } = require("socket.io")
const cors = require("cors");
app.use(express.json())
app.use(cors());
const bookModel = require("./models/book.model")
const userModel = require("./models/user.model")


const http_server = http.createServer(app)
const wss = new Server(http_server)



app.get("/books", async (req, res) => {
    try {
        const books = await bookModel.find(); // Correct method
        res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Error fetching books" });
    }
});


app.delete("/books/:id", async (req, res) => {
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
});



app.post("/books/add", async (req, res) => {
    try {
        const { title, author, publication_year, genre, description, cover_image, is_available } = req.body;
        const book_present = await bookModel.find({ title, author });

        if (book_present) {
            return res.status(400).json({ message: "Book already present" });
        }
        await bookModel.create({ title, author, publication_year, genre, description, cover_image, is_available })
        res.status(202).json({ message: "Book added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error while adding book", error });
    }
});



app.post("/user/register", userRegister)
app.post("/user/login", userLogin)

app.get("/users/", async (req, res) => {
    try {
        const users = await userModel.find()
        res.status(200).json(users)
    } catch (error) {
        console.log("error while fetching users", error)
        res.status(404).json("error while fetching users")
    }
})


// app.use("/admin",(req,res)=>{
//     res.send("admin")
// })


app.post("/admin/login", adminLogin)










wss.on("connection", (socket) => {
    socket.on("user-msg", (data) => {
        console.log(data)
    })

    socket.on("borrow-request", async (data) => {
        try {
            console.log("Borrow request received:", data);

            // Fetch the book details
            const book = await bookModel.findOne({ _id: data.bookId });


            // Update book availability
            const updateResult = await bookModel.updateOne(
                { _id: data.bookId },
                { is_available: false }
            );

            if (updateResult.modifiedCount > 0) {
                console.log("Book marked as unavailable:", data.bookId);

                // Emit update event to all clients
                wss.emit("available-update", { bookId: data.bookId, is_available: false });

                // Notify admins about the borrow request
                // wss.to("admin-room").emit("new-borrow-request", data);
                wss.emit("new-borrow-request", data);
            } else {
                console.log("Book availability update failed.");
            }
        } catch (error) {
            console.error("Error processing borrow request:", error);
            socket.emit("borrow-error", { message: "An error occurred while processing your request." });
        }
    });





    // console.log("clint connected",socket.id)
})


http_server.listen(8080, async () => {
    try {
        await connection
        console.log("connected to db")
    } catch (error) {
        console.log("error while connecting to db", error)
    }
    console.log("listening on 8080")
})

