// // backend/index.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const {autoMarkAbsent} = require("./Controllers/attendanceController");
// const cron = require("node-cron");

// // THE CRON SOFTWARE WILL TRIGGER TEH AUTOMARKABSENT FUNCTION EVERYDAY BY 10.00AM
// cron.schedule('0 10 * * *', () => {
//     autoMarkAbsent();
// });

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Database Connection
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => console.log("Connected to MongoDB"))
//   .catch(err => console.log("MongoDB connection error:", err));

// // Routes
// app.use('/api/auth', require('./Routes/authRoutes'));
// app.use('/api/attendance', require('./Routes/attendanceRoute'));



// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require("node-cron");
const http = require('http');
const { Server } = require('socket.io');
const { autoMarkAbsent } = require("./Controllers/attendanceController");

dotenv.config();
const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Replace '*' with your frontend URL in production
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("MongoDB connection error:", err));

// Socket.IO Connection
io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);
    
    // Optional: handle disconnection
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Pass the io instance to routes
const attendanceRoutes = require('./Routes/attendanceRoute')(io);
app.use('/api/auth', require('./Routes/authRoutes'));
app.use('/api/attendance', attendanceRoutes);

// Modify autoMarkAbsent function to emit events
cron.schedule('0 10 * * *', async () => {
    const absentees = await autoMarkAbsent(io); // Pass io to autoMarkAbsent
    absentees.forEach((employee) => {
        io.emit('attendance-update', `Employee ${employee.employeeId} marked absent for today`);
    });
});

// Server Listener
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

