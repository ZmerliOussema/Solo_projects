import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.mongoose.js";

dotenv.config({path: '../.env'});

const app = express();
const PORT = process.env.PORT;

// Test route
app.get("/test", (req, res) => {
    res.send("Test route is working!");
});

app.listen(PORT, () => {
	connectDB();
	console.log("Server started at http://localhost:" + PORT);
});