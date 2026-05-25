const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

const authRouters = require("./routes/auth-route");
const { protect } = require("./middleware/auth-middleware");
const serviceRoutes = require("./routes/service-route");
const bookingRoutes = require("./routes/booking-route");
const userRoutes = require("./routes/user-route");
const paymentRoutes = require("./routes/payment-route");
const chatRoutes = require("./routes/chat-route");
const adminRoutes = require("./routes/admin-route");
const providerRoutes = require("./routes/provider-route");
const setupSocket = require("./socket/socket");

dotenv.config();

const app = express();

const server = http.createServer(app);

const io = setupSocket(server);

server.keepAliveTimeout = 120000;
server.headersTimeout = 120000;

// Middlewares
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://quickfix-frontend-85am9xqvj-aman05hubs-projects.vercel.app",
        "https://quickfix-frontend-git-main-aman05hubs-projects.vercel.app",
        "https://quickfix-frontend.vercel.app"
    ],
    credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use("/api/auth", authRouters);
app.use("/api/user", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/provider", providerRoutes);

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => console.log("MongoDB Connected"));
mongoose.connection.on("error", (err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Backend Running..");
});

app.get("/api/protected", protect, (req, res) => {
    res.json({
        message: "You accessed protected route",
        user: req.user
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});