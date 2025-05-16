"use client"
import { useState, useEffect, useCallback } from "react"
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
    Skeleton,
} from "@chakra-ui/react"
import { debounce } from "lodash" // You may need to install lodash

const ProductFormModal = ({
    isOpen,
    onClose,
    mode = "add", // "add" or "edit"
    product = null, // product data for edit mode
    onSubmit, // function to handle form submission (addProduct or updateProduct)
}) => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        imageURL: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isImageLoading, setIsImageLoading] = useState(false)
    const [imageError, setImageError] = useState(false)
    const toast = useToast()

    const isEditMode = mode === "edit"

    // Color values based on color mode
    const cardBg = useColorModeValue("white", "gray.700")
    const textColor = useColorModeValue("gray.600", "gray.200")
    const headingColor = useColorModeValue("gray.800", "white")
    const borderColor = useColorModeValue("gray.200", "gray.600")
    const inputBg = useColorModeValue("white", "gray.700")
    const imagePreviewBg = useColorModeValue("gray.100", "gray.700")

    // Set form data when editing a product or reset when modal closes
    useEffect(() => {
        if (!isOpen) {
            resetForm()
            return
        }

        if (isEditMode && product) {
            setFormData({
                name: product.name || "",
                price: product.price ? product.price.toString() : "",
                imageURL: product.imageURL || "",
            })
            // Set image loading state if there's an image URL
            setIsImageLoading(!!product.imageURL)
            setImageError(false)
        }
    }, [isOpen, isEditMode, product])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })

        // If changing image URL, set loading state
        if (name === "imageURL" && value) {
            setIsImageLoading(true)
            setImageError(false)
            // Use debounced image validation to prevent excessive processing
            debouncedValidateImage(value)
        }
    }

    // Debounced function to validate image URL
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedValidateImage = useCallback(
        debounce((url) => {
            if (!url) {
                setIsImageLoading(false)
                return
            }

            const img = new Image()
            img.onload = () => {
                setIsImageLoading(false)
                setImageError(false)
            }
            img.onerror = () => {
                setIsImageLoading(false)
                setImageError(true)
            }
            img.src = url
        }, 500),
        [],
    )

    const handlePriceChange = (value) => {
        setFormData({
            ...formData,
            price: value,
        })
    }

    const resetForm = () => {
        setFormData({
            name: "",
            price: "",
            imageURL: "",
        })
        setIsImageLoading(false)
        setImageError(false)
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
            // Prepare the product data
            const productData = {
                ...formData,
                price: Number.parseFloat(formData.price),
            }

            // If in edit mode, include the original product id
            if (isEditMode && product) {
                productData._id = product._id
            }

            // Call the onSubmit function passed from parent
            if (typeof onSubmit === "function") {
                if (isEditMode && product) {
                    await onSubmit(productData._id, productData)
                } else {
                    await onSubmit(productData)
                }

            }

            // Show success message
            toast({
                title: isEditMode ? "Product updated" : "Product added",
                description: isEditMode
                    ? "Your product has been successfully updated."
                    : "Your product has been successfully added.",
                status: "success",
                duration: 5000,
                isClosable: true,
            })

            // Reset form and close modal
            resetForm()
            onClose()
        } catch (error) {
            toast({
                title: "Error",
                description: `There was an error ${isEditMode ? "updating" : "adding"} your product.`,
                status: "error",
                duration: 5000,
                isClosable: true,
            })
            console.error(`Error ${isEditMode ? "updating" : "submitting"} form:`, error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Memoized image preview component to prevent unnecessary re-renders
    const ImagePreview = () => {
        if (!formData.imageURL) return null

        return (
            <Box borderWidth="1px" borderRadius="md" overflow="hidden" alignSelf="center" width="100%">
                <Text fontSize="sm" fontWeight="medium" p={2} bg={imagePreviewBg}>
                    Image Preview
                </Text>
                <Box p={3} textAlign="center" height="220px" position="relative">
                    {isImageLoading && <Skeleton height="200px" width="100%" position="absolute" top="10px" left="0" />}

                    {imageError ? (
                        <Box height="200px" display="flex" alignItems="center" justifyContent="center" color="red.500">
                            <Text>Invalid image URL</Text>
                        </Box>
                    ) : (
                        <Box
                            as="img"
                            src={formData.imageURL}
                            alt="Product preview"
                            maxH="200px"
                            mx="auto"
                            display={isImageLoading ? "none" : "block"}
                            onError={() => setImageError(true)}
                            onLoad={() => setIsImageLoading(false)}
                        />
                    )}
                </Box>
            </Box>
        )
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent bg={cardBg}>
                <ModalHeader color={headingColor}>{isEditMode ? "Edit Product" : "Add New Product"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form id="product-form" onSubmit={handleSubmit}>
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

                            {formData.imageURL && <ImagePreview />}
                        </VStack>
                    </form>
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="outline"
                        mr={3}
                        onClick={() => {
                            resetForm()
                            onClose()
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="product-form"
                        colorScheme="teal"
                        isLoading={isSubmitting}
                        loadingText={isEditMode ? "Updating..." : "Adding..."}
                    >
                        {isEditMode ? "Update Product" : "Add Product"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ProductFormModal
