const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
// ...existing code...
const path = require('path'); // Node.js path module
const studyMaterialRoutes = require('./router/studymatRoute.js');

const courseRoutes = require('./router/courseRoutes');

// ...existing code...
// ...existing code...
// Enable CORS for all routes
// Load environment variables as early as possible
dotenv.config();

// Ensure db.js is correctly setting up the connection to MongoDB
// and is exporting a function to initiate the connection.
const connectDB = require("./db"); // Correct path assuming db.js is in the same directory

// Assuming userRoute.js contains your authentication (register, login)
// and user-related (get users) routes, and is exporting `router`.
const userRoutes = require("./router/authRoutes"); // Renamed for clarity as it includes auth

const app = express();

app.use(cors()); 

// Middleware to parse JSON request bodies
app.use(express.json());
// Connect to the database
// Call the function exported from db.js to connect to MongoDB
connectDB();

// Use your user and authentication routes.
// All routes defined in userRoutes (e.g., /register, /login, /users)
// will be prefixed with /api.
app.use("/api", userRoutes); // Changed from /api/users to /api to reflect general API routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/courses', courseRoutes);
app.use('/api/study-materials', studyMaterialRoutes);
// Basic error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Define the port for the server
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});