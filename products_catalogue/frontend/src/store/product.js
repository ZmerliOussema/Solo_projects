import {create} from 'zustand'
import axios from 'axios'

export const useProductStore = create((set) => ({
    
    products : [], // Getter
    product: {},
    setProducts: products => set({products}), // Setter

    // Fetch all available products
    getProducts: async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/products');
            set({ products: res.data.data})
        } catch (error) {
            console.log(error.message);
        }
        
    },

    // Fetch one single product by its Id
    getOneProduct: async (product) => {
        try {
            const res = await axios.get(`http://localhost:8000/api/products/${product._id}`);
            set({product: res.data.data})
            console.log(product);
        } catch (error) {
            console.log(error.message);
        }
    },

    // Add a new product
    addProduct: async (newProduct) => {
        try {
            const res = await axios.post('http://localhost:8000/api/products', newProduct)
            set((state) => ({ products: [...state.products, res.data.data]}))
        } catch (error) {
            console.log(error.message);
        }
    },

    // Update an existing product
    updateProduct: async (id, updatedProduct) => {
        try {
            const res = await axios.put(`http://localhost:8000/api/products/${id}`, updatedProduct);
            // Update the UI immediately, without needing a refresh
            set((state) => ({products: state.products.map((product) => (product._id === id? res.data.data: product))}))
        } catch (error) {
            console.log(error.message);
        }
    },

    deleteProduct: async (id) => {
        try {
            const res = await axios.delete(`http://localhost:8000/api/products/${id}`);
            // if (!res.data.data.success) return {success: false, message: res.data.data.message}
            // update the UI immediately, without refreshing the page
            set((state) => ({ products: state.products.filter((product) => product._id !== id)}))
        } catch (error) {
            console.log(error.message);
        }
    }
}))