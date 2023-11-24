const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({
    origin: "*"
}));
const { addUser } = require('./utils/users');
const mongoose = require('mongoose');
const userRoute = require("./routes/userRoutes");
const http = require('http');
const socketIO = require('socket.io');

// Use process.env.PORT for dynamic port allocation by the hosting service
const PORT = process.env.PORT || 3001;

// Create a server using http module
const server = http.createServer(app);

// Create a Socket.IO instance
const io = socketIO(server, {
    cors: {
        origin: ['http://localhost:3000'], // Update with your frontend URL
    }
});

// Middleware to parse JSON
app.use(express.json());

mongoose.set('strictQuery', false);

// Update MongoDB connection string. Use process.env.MONGODB_URI for security.
mongoose
    .connect(process.env.MONGODB_URI || "mongodb+srv://inkCrypt:9K2al4Z4QPyF01Lt@cluster-1.yv9pqws.mongodb.net/", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("db connected");
    })
    .catch((err) => console.log(err));

// Use the userRoute
app.use("/users", userRoute);

// Listen on the specified PORT
server.listen(PORT, () => console.log(`Server running at ${PORT}`));

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(socket.id);

    // Handle socket disconnect
    socket.on('disconnect', () => {
        console.log(`disconnected ${socket.id}`);
    });

    // Handle message send and receive
    socket.on('send', (m) => {
        socket.broadcast.emit('recieve', m);
    });

    // Handle user joining
    socket.on("Join-User", (data) => {
        const { username, roomId } = data;
        socket.join(roomId);
        const user = addUser(data);
        socket.emit("User-Joined", { success: true, data });
    });

    // Handle image send and receive
    socket.on("image", (data) => {
        socket.broadcast.to(data.roomId).emit("imageres", {
            imgUrl: data.img
        });
    });
});
