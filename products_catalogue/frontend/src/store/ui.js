import {create} from 'zustand';

// Defines a custom hook called useUIStore
// The set function is provided by Zustand to update the store state
const useUIStore = create((set) => ({
    // Initialzation: Add Product is closed by default
    isAddProductModalOpen: false,
    // A function that updates the state of the open modal to true
    openAddProductModal: () => set({
        isAddProductModalOpen: true }),
    // A function that updates the state of the open modal to false
    closeAddProductModal: () => set({
        isAddProductModalOpen: false
    })
}))

export default useUIStore;