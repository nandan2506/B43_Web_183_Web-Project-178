const express = require("express");
const http = require("http");
const app = express();
const { connection } = require("./config/db");
const { Server } = require("socket.io");
const cors = require("cors");

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

// Import Routes
const bookModel = require("./models/book.model");
const userRoutes = require("./routes/user.routes");
const bookRoutes = require("./routes/book.routes");
const adminRoutes = require("./routes/admin.routes");

const http_server = http.createServer(app);


const wss = new Server(http_server, {
    cors: {
        origin: "*", // Allow all origins (change this if needed)
        methods: ["GET", "POST"],
    },
    allowEIO3: true, 
});

// Routes
app.use("/user", userRoutes);
app.use("/books", bookRoutes);
app.use("/admin", adminRoutes);

// Socket.io event handlers
wss.on("connection", (socket) => {
    console.log("New WebSocket connection established");

    socket.on("borrow-request", async (data) => {
        try {
            console.log("Borrow request received:", data);

            // Update book availability
            const updateResult = await bookModel.updateOne(
                { _id: data.bookId },
                { is_available: false },
                { new: true }
            );

            if (updateResult.modifiedCount > 0) {
                console.log("Book marked as unavailable:", data.bookId);

                // Emit update event to all clients
                wss.emit("available-update", { bookId: data.bookId, is_available: false });

                // Notify admins about the borrow request
                wss.emit("new-borrow-request", data);

                console.log("Borrow request sent from server to admin:", data);
            } else {
                console.log("Book availability update failed.");
            }
        } catch (error) {
            console.error("Error processing borrow request:", error);
            socket.emit("borrow-error", { message: "An error occurred while processing your request." });
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

// Start the server
http_server.listen(PORT, async () => {
    try {
        await connection;
        console.log("✅ Connected to DB");
    } catch (error) {
        console.log("❌ Error while connecting to DB:", error);
    }
    console.log(`🚀 Server running on port ${PORT}`);
});
