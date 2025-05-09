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
        
    }
}))