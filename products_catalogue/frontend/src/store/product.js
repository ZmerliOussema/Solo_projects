import {create} from 'zustand'
import axios from 'axios'

export const useProductStore = create((set) => ({
    
    products : [], // Getter
    setProducts: products => set({products}), // Setter

    // Fetch all available products
    getProducts: async () => {
        try {
            const res = await axios.get('/api/products');
            set({ products: res.data.data})
        } catch (error) {
            console.log(error.message);
        }
        
    },

    // add a new product
    addProduct: async (newProduct) => {
        try {
            const res = await axios.post('/api/products', {newProduct})
            set((state) => ({ products: [...state.products, res.data]}))
        } catch (error) {
            console.log(error.message);
        }
    }
}))