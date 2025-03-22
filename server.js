const express = require("express")
const http = require("http")
const app = express()
const { connection } = require("./config/db")
const { Server } = require("socket.io")
const cors = require("cors");
app.use(express.json())
app.use(cors());
const bookModel = require("./models/book.model")

const userRoutes = require("./routes/user.routes");
const bookRoutes = require("./routes/book.routes");
const adminRoutes  = require("./routes/admin.routes")
const PORT = process.env.PORT || 8080;


const http_server = http.createServer(app)
const wss = new Server(http_server)



app.use("/user", userRoutes); 
app.use("/books",bookRoutes );
app.use("/admin", adminRoutes)



wss.on("connection", (socket) => {

    socket.on("borrow-request", async (data) => {
        // data = userId, bookId
        try {
            console.log("Borrow request received:", data);


            // Update book availability
            const updateResult = await bookModel.updateOne(
                { _id: data.bookId },
                { is_available: false },
                { new: true }
                
            );
            console.log("updated book",updateResult)

            if (updateResult.modifiedCount > 0) {
                console.log("Book marked as unavailable:", data.bookId);
            
                // Emit update event to all clients
                wss.emit("available-update", { bookId: data.bookId, is_available: false });
            
                // Log connected clients for debugging
                console.log("Connected clients:");
            
                // Notify admins about the borrow request
                wss.emit("new-borrow-request", data);
                // data = userId, bookId
                console.log("Borrow request sent from server to admin:", data);
            
            } else {
                console.log("Book availability update failed.");
                console.log("Update result:", updateResult); // Debugging
            }
            
        } catch (error) {
            console.error("Error processing borrow request:", error);
            socket.emit("borrow-error", { message: "An error occurred while processing your request." });
        }
    });
})


http_server.listen(PORT, async () => {
    try {
        await connection
        console.log("connected to db")
    } catch (error) {
        console.log("error while connecting to db", error)
    }
    console.log("listening on 8080")
})

