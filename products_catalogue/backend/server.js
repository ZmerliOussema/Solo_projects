import express from "express";
import { connectDB } from "./config/db.mongoose.js";
import router from "./routes/product.routes.js";
import cors from 'cors';

const app = express();
const PORT = process.env.PORT;

// Test route
// app.get("/test", (req, res) => {
//     res.send("Test route is working!");
// });

app.use(cors({ origin: 'http://localhost:5173', credentials: true}))

app.use(express.json()); // allows us to accept JSON data in the req.body

app.use('/api/products', router)

app.listen(PORT, () => {
	connectDB();
	console.log("Server started at http://localhost:" + PORT);
});