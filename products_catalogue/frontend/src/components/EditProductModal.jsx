"use client"
import { useState, useEffect } from "react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Button,
    VStack,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    FormHelperText,
    Box,
    Text,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react"

const EditProductModal = ({ isOpen, onClose, updateProduct, productToEdit }) => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        imageURL: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const toast = useToast()

    // Color values based on color mode
    const cardBg = useColorModeValue("white", "gray.700")
    const textColor = useColorModeValue("gray.600", "gray.200")
    const headingColor = useColorModeValue("gray.800", "white")
    const borderColor = useColorModeValue("gray.200", "gray.600")
    const inputBg = useColorModeValue("white", "gray.700")
    const imagePreviewBg = useColorModeValue("gray.100", "gray.700")

    // Set form data when editing a product
    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name,
                price: productToEdit.price.toString(),
                imageURL: productToEdit.imageURL || "",
            })
        }
    }, [productToEdit])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handlePriceChange = (value) => {
        setFormData({
            ...formData,
            price: value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Basic validation
        if (!formData.name || !formData.price || !formData.imageURL) {
            toast({
                title: "Missing fields",
                description: "Please fill in all required fields.",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
            return
        }

        setIsSubmitting(true)

        try {
            // Here you would typically make an API call to update the product
            console.log("Update form submitted:", formData)

            // If you have an updateProduct function in your store
            if (typeof updateProduct === "function" && productToEdit) {
                updateProduct(productToEdit._id, {
                    ...productToEdit,
                    name: formData.name,
                    price: Number.parseFloat(formData.price),
                    imageURL: formData.imageURL,
                })
            }

            // Show success message
            toast({
                title: "Product updated",
                description: "Your product has been successfully updated.",
                status: "success",
                duration: 5000,
                isClosable: true,
            })

            // Close modal
            onClose()
        } catch (error) {
            toast({
                title: "Error",
                description: "There was an error updating your product.",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
            console.error("Error updating form:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent bg={cardBg}>
                <ModalHeader color={headingColor}>Edit Product</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form id="edit-product-form" onSubmit={handleSubmit}>
                        <VStack spacing={6} align="flex-start">
                            <FormControl isRequired>
                                <FormLabel color={headingColor}>Product Name</FormLabel>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter product name"
                                    bg={inputBg}
                                    borderColor={borderColor}
                                />
                                <FormHelperText color={textColor}>Enter the name of your product.</FormHelperText>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel color={headingColor}>Price</FormLabel>
                                <NumberInput min={0} precision={2} step={0.01} value={formData.price} onChange={handlePriceChange}>
                                    <NumberInputField name="price" placeholder="0.00" bg={inputBg} borderColor={borderColor} />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <FormHelperText color={textColor}>Enter the price in dollars.</FormHelperText>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel color={headingColor}>Image URL</FormLabel>
                                <Input
                                    name="imageURL"
                                    value={formData.imageURL}
                                    onChange={handleInputChange}
                                    placeholder="Enter image URL"
                                    bg={inputBg}
                                    borderColor={borderColor}
                                />
                                <FormHelperText color={textColor}>Provide a URL to an image of your product (optional).</FormHelperText>
                            </FormControl>

                            {formData.imageURL && (
                                <Box borderWidth="1px" borderRadius="md" overflow="hidden" alignSelf="center" width="100%">
                                    <Text fontSize="sm" fontWeight="medium" p={2} bg={imagePreviewBg}>
                                        Image Preview
                                    </Text>
                                    <Box p={3} textAlign="center">
                                        <Box
                                            as="img"
                                            src={formData.imageURL}
                                            alt="Product preview"
                                            maxH="200px"
                                            mx="auto"
                                            onError={(e) => {
                                                e.target.src = "/placeholder.svg?height=200&width=300"
                                                e.target.onerror = null
                                            }}
                                        />
                                    </Box>
                                </Box>
                            )}
                        </VStack>
                    </form>
                </ModalBody>

                <ModalFooter>
                    <Button variant="outline" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="edit-product-form"
                        colorScheme="teal"
                        isLoading={isSubmitting}
                        loadingText="Updating..."
                    >
                        Update Product
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditProductModal
