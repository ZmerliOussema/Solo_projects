import express from "express";
import { connectDB } from "./config/db.mongoose.js";
import router from "./routes/product.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT;


app.use(cors({ origin: 'http://localhost:5173', credentials: true}))

app.use(express.json()); // allows us to accept JSON data in the req.body

// Serve static uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/products', router)
app.use('/api/upload', uploadRoutes);

app.listen(PORT, () => {
	connectDB();
	console.log("Server started at http://localhost:" + PORT);
});