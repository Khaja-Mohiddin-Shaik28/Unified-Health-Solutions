const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require("cookie-parser");

// router import
const loginRegisterRouter = require("./router/loginRegisterRoute");

// CORS Setup
const corsOptions = {
    origin: function(origin, callback) {
        // allow requests with no origin (Postman, curl, mobile apps)
        if (!origin) return callback(null, true);

        // allow localhost for development
        if (origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")) {
            return callback(null, true);
        }

        // allow all Vercel deployments
        if (origin.endsWith(".vercel.app")) {
            return callback(null, true);
        }

        // block all other origins
        return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true // allow cookies/auth
};

app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database Connection
const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.dbURL || "mongodb+srv://Test:1234@cluster0.oyxicni.mongodb.net/phase1-demo?retryWrites=true&w=majority&appName=Cluster0");
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server running on port ${process.env.PORT || 3000}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};
dbConnection();

// Routes
app.use("/api", loginRegisterRouter);
