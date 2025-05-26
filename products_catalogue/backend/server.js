import express from "express";
import { connectDB } from "./config/db.mongoose.js";
import router from "./routes/product.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Static route for uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API routes
app.use('/api/products', router);
app.use('/api/upload', uploadRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
	const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
	app.use(express.static(frontendPath));

	app.get('/:wildcard(*)', (req, res) => {
		res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
	});

}

// Start server
app.listen(PORT, () => {
	connectDB();
	console.log(`Server started at http://localhost:${PORT}`);
});
