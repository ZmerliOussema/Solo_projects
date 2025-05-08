import Product from "../models/product.model.js"
import mongoose from "mongoose"

// Get all products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}) // Product.find({}): find all products in the database
        res.status(200).json({ success: true, data: products })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get one product by Id
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json({ success: true, data: product })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Create a product
export const createProduct = async (req, res) => {
    
    const product = req.body; // User will send this data
    if (!product.name || !product.price || !product.imageURL) {
        return res.status(400).json({ succes: false, message: 'Please provide all fields' })
    }

    const newProduct = new Product(product);
    try {
        await newProduct.save();
        res.status(201).json({ succes: true, data: newProduct})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message});
    }
}

// Update an existing product
export const updateProduct = async (req, res) => {
    const {id} = req.params;

    const product = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Product Id" });
	}

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, {new: true});
        res.status(200).json({ success: true, data: updatedProduct});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message});
    }
}

// Delete an existing product
export const deleteProduct = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Product Id" });
	}

    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Product deleted succefully'});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message});
    }
}