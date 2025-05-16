import {create} from 'zustand';

// Defines a custom hook called useUIStore
// The set function is provided by Zustand to update the store state
const useUIStore = create((set) => ({
    // Add product Modal
    isAddProductModalOpen: false,
    openAddProductModal: () => set({
        isAddProductModalOpen: true }),
    closeAddProductModal: () => set({
        isAddProductModalOpen: false
    }),

    // Edit Product Modal
    isEditProductModalOpen: false,
    productToEdit: null,
    openEditProductModal: (product) => 
        set({
            isEditProductModalOpen: true,
            productToEdit: product
        }),
    closeEditProductModal: () => 
        set({
            isEditProductModalOpen: false,
            productToEdit: null
        })
}))

export default useUIStore;