"use client"
import { useState, useEffect, useCallback, useRef } from "react"
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
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Flex,
    Icon,
    InputGroup,
    InputRightElement,
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
    const [imageSource, setImageSource] = useState("url") // "url" or "file"
    const [imageFile, setImageFile] = useState(null)
    const [previewSrc, setPreviewSrc] = useState("")
    const fileInputRef = useRef(null)
    const toast = useToast()

    const isEditMode = mode === "edit"

    // Color values based on color mode
    const cardBg = useColorModeValue("white", "gray.700")
    const textColor = useColorModeValue("gray.600", "gray.200")
    const headingColor = useColorModeValue("gray.800", "white")
    const borderColor = useColorModeValue("gray.200", "gray.600")
    const inputBg = useColorModeValue("white", "gray.700")
    const imagePreviewBg = useColorModeValue("gray.100", "gray.700")
    const uploadBgColor = useColorModeValue("gray.50", "gray.600")

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

            // If product has an image URL, set it as preview and set image source to URL
            if (product.imageURL) {
                setPreviewSrc(product.imageURL)
                setImageSource("url")
                setIsImageLoading(true)
            } else {
                setPreviewSrc("")
            }

            setImageError(false)
            setImageFile(null)
        }
    }, [isOpen, isEditMode, product])

    // Update preview source when image source or URL changes
    useEffect(() => {
        if (imageSource === "url" && formData.imageURL) {
            setPreviewSrc(formData.imageURL)
        }
    }, [imageSource]) // Only run when imageSource changes

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })

        // If changing image URL, set loading state and update preview immediately
        if (name === "imageURL") {
            if (value) {
                setIsImageLoading(true)
                setImageError(false)
                setPreviewSrc(value) // Immediately set preview source
                // Use debounced image validation to prevent excessive processing
                debouncedValidateImage(value)
            } else {
                setPreviewSrc("") // Clear preview when URL is empty
                setIsImageLoading(false)
            }
        }
    }

    const debouncedValidateImage = useCallback(
        debounce((url) => {
            if (!url) {
                setIsImageLoading(false)
                return
            }

            const img = new Image()
            img.crossOrigin = "*" // Add this to avoid CORS issues
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

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
        if (!validTypes.includes(file.type)) {
            toast({
                title: "Invalid file type",
                description: "Please upload a valid image file (JPEG, PNG, GIF, WEBP)",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
            return
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            toast({
                title: "File too large",
                description: "Please upload an image smaller than 5MB",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
            return
        }

        setIsImageLoading(true)
        setImageError(false)

        // Read file and create preview
        const reader = new FileReader()
        reader.onload = (event) => {
            setPreviewSrc(event.target.result)
            setImageFile(file)
            setIsImageLoading(false)
        }
        reader.onerror = () => {
            setImageError(true)
            setIsImageLoading(false)
            toast({
                title: "Error reading file",
                description: "There was an error reading the selected file",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
        }
        reader.readAsDataURL(file)
    }

    const handleImageSourceChange = (index) => {
        const newSource = index === 0 ? "url" : "file"
        setImageSource(newSource)

        // Clear the preview when switching
        if (newSource === "url") {
            setImageFile(null)
            if (formData.imageURL) {
                setPreviewSrc(formData.imageURL)
                setIsImageLoading(true)
                debouncedValidateImage(formData.imageURL)
            } else {
                setPreviewSrc("")
            }
        } else {
            // Keep existing file preview if any
            if (!imageFile) {
                setPreviewSrc("")
            }
        }
    }

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const resetForm = () => {
        setFormData({
            name: "",
            price: "",
            imageURL: "",
        })
        setIsImageLoading(false)
        setImageError(false)
        setPreviewSrc("")
        setImageSource("url")
        setImageFile(null)

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Basic validation
        if (!formData.name || !formData.price) {
            toast({
                title: "Missing fields",
                description: "Please fill in all required fields.",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
            return
        }

        // Validate that either imageURL or imageFile is provided
        if (imageSource === "url" && !formData.imageURL) {
            toast({
                title: "Missing image",
                description: "Please provide an image URL.",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
            return
        }

        if (imageSource === "file" && !imageFile) {
            toast({
                title: "Missing image",
                description: "Please upload an image file.",
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

            // Handle image source
            if (imageSource === "file" && imageFile) {
                // In a real application, you would upload the file to a server
                // and get back a URL. For this example, we'll use the data URL.
                productData.imageURL = previewSrc
            }

            // If in edit mode, include the original product id
            if (isEditMode && product) {
                productData._id = product._id

                // Call the onSubmit function with the expected parameters
                if (typeof onSubmit === "function") {
                    await onSubmit(productData._id, productData)
                }
            } else {
                // For add mode
                if (typeof onSubmit === "function") {
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

    // Image Preview component
    const ImagePreview = () => {
        if (!previewSrc) return null

        return (
            <Box borderWidth="1px" borderRadius="md" overflow="hidden" alignSelf="center" width="100%">
                <Text fontSize="sm" fontWeight="medium" p={2} bg={imagePreviewBg}>
                    Image Preview
                </Text>
                <Box p={3} textAlign="center" height="220px" position="relative">
                    {isImageLoading && (
                        <Skeleton height="200px" width="100%" position="absolute" top="10px" left="0" zIndex="1" />
                    )}

                    {imageError ? (
                        <Box height="200px" display="flex" alignItems="center" justifyContent="center" color="red.500">
                            <Text>Invalid image</Text>
                        </Box>
                    ) : (
                        <Box
                            as="img"
                            src={previewSrc}
                            alt="Product preview"
                            maxH="200px"
                            mx="auto"
                            display={isImageLoading ? "none" : "block"}
                            onError={() => setImageError(true)}
                            onLoad={() => setIsImageLoading(false)}
                            crossOrigin="anonymous"
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
                                <FormLabel color={headingColor}>Product Image</FormLabel>

                                <Tabs
                                    isFitted
                                    variant="enclosed"
                                    onChange={handleImageSourceChange}
                                    defaultIndex={imageSource === "url" ? 0 : 1}
                                >
                                    <TabList mb="1em">
                                        <Tab>Image URL</Tab>
                                        <Tab>Upload Image</Tab>
                                    </TabList>
                                    <TabPanels>
                                        {/* Image URL Tab */}
                                        <TabPanel p={0}>
                                            <InputGroup size="md">
                                                <Input
                                                    name="imageURL"
                                                    value={formData.imageURL}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter image URL"
                                                    bg={inputBg}
                                                    borderColor={borderColor}
                                                />
                                                {formData.imageURL && (
                                                    <InputRightElement width="4.5rem">
                                                        <Button
                                                            h="1.75rem"
                                                            size="sm"
                                                            onClick={() => {
                                                                setFormData({ ...formData, imageURL: "" })
                                                                setPreviewSrc("")
                                                            }}
                                                        >
                                                            Clear
                                                        </Button>
                                                    </InputRightElement>
                                                )}
                                            </InputGroup>
                                            <FormHelperText color={textColor}>Provide a URL to an image of your product.</FormHelperText>
                                        </TabPanel>

                                        {/* Upload Image Tab */}
                                        <TabPanel p={0}>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                style={{ display: "none" }}
                                            />
                                            <Flex
                                                direction="column"
                                                align="center"
                                                justify="center"
                                                p={6}
                                                borderWidth="2px"
                                                borderStyle="dashed"
                                                borderColor={borderColor}
                                                borderRadius="md"
                                                bg={uploadBgColor}
                                                cursor="pointer"
                                                onClick={triggerFileInput}
                                                _hover={{ bg: useColorModeValue("gray.100", "gray.500") }}
                                            >
                                                <Icon viewBox="0 0 24 24" boxSize={8} color="gray.400" mb={2}>
                                                    <path
                                                        fill="currentColor"
                                                        d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"
                                                    />
                                                </Icon>
                                                <Text fontWeight="medium" mb={1}>
                                                    Click to upload
                                                </Text>
                                                <Text fontSize="sm" color={textColor}>
                                                    PNG, JPG, GIF, WEBP up to 5MB
                                                </Text>
                                                {imageFile && (
                                                    <Text mt={2} fontSize="sm" color="teal.500">
                                                        Selected: {imageFile.name}
                                                    </Text>
                                                )}
                                            </Flex>
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </FormControl>

                            {previewSrc && <ImagePreview />}
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
