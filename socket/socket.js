const { Server } = require("socket.io");


function setupSocket(server) {

    const io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:5173", 
                "https://quick-fix-mdud.onrender.com"
            ],
            
            methods: ["GET", "POST"],
            credentials: true
        },
        transports: ["polling", "websocket"]
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        //Join room
        socket.on("join_room", (bookingId) => {
            socket.join(bookingId);
            console.log("Joined room:", bookingId);
        })

        //Send message
        socket.on("send_message", (data) => {
            console.log("Message:", data);

            io.to(data.bookingId).emit("receive_message", data);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
}

module.exports = setupSocket;