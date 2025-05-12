"use client"
import { useEffect, useState } from "react"
import { useProductStore } from "../store/product"
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    useColorModeValue,
    Flex,
    Image,
    Button,
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
    VStack,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    FormHelperText,
    // useDisclosure,
    useToast,
    Icon,
} from "@chakra-ui/react"
import useUIStore from "../store/ui"

const Home = () => {
    const { getProducts, products, addProduct } = useProductStore();
    // const { onOpen, onClose } = useDisclosure();
    const {isAddProductModal, closeAddProductModal, openAddProductModal} = useUIStore()
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        imageURL: ""
    })
    const toast = useToast();
    // Why it's used:
    // Disabling the submit button during submission to prevent double submits.
    // Showing a loading spinner
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch all available products
    useEffect(() => {
        getProducts()
    }, [getProducts]) // It will re-render on every change of products.

    // resetForm function
    const resetForm = () => {
        setFormData({
            name: "",
            price: "",
            imageURL: ""
        })
    }

    // handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.price || !formData.imageURL) {
            toast({
                title: "Missing fields",
                description: "Please fill in all required fields",
                status: "error",
                duration: 3000,
                isClosable: true
            })
            return;
        }

        setIsSubmitting(true);

        try {
            // Using addProduct function in the store
            if (typeof addProduct === "function") {
                addProduct({
                    ...formData,
                    price: Number.parseFloat(formData.price)
                })
            }

            // Show success message
            toast({
                title: "Product added",
                description: "Your product has been succefully added.",
                status: "success",
                duration: 5000,
                isClosable: true
            })

            // Reset form and close modal
            resetForm();
            closeAddProductModal();
        } catch (error) {
            toast({
                title: "Erroe",
                description: "There was an error adding your product.",
                status: "error",
                duration: 5000,
                isClosable: true
            })
            console.log("Error submitting form: ", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    // handldeInputChange function
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    // handlePriceChange
    const handlePriceChange = (value) => {
        setFormData({
            ...formData,
            price: value
        })
    }

    // Color values based on color mode
    const bgColor = useColorModeValue("gray.50", "gray.900")
    const cardBg = useColorModeValue("white", "gray.700")
    const textColor = useColorModeValue("gray.600", "gray.200")
    const headingColor = useColorModeValue("gray.800", "white")
    const borderColor = useColorModeValue("gray.200", "gray.600")
    const inputBg = useColorModeValue("white", "gray.700")
    const imagePreviewBg = useColorModeValue("gray.100", "gray.700")

    return (
        <Box bg={bgColor} minH="100vh">
            <Container maxW="container.xl" py={8}>
                <Flex
                    direction={{ base: "column", md: "row" }}
                    align={{ base: "center", md: "center" }}
                    justify="space-between"
                    mb={8}
                    wrap="wrap"
                >
                    <Heading
                        as="h1"
                        size="xl"
                        color={headingColor}
                        textAlign={{ base: "center", md: "left" }}
                        mb={{ base: 4, md: 0 }}
                    >
                        Current Products{" "}
                        <Text as="span" fontSize="3xl">
                            🚀
                        </Text>
                    </Heading>
                </Flex>

                {products.length === 0 ? (
                    <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        textAlign="center"
                        py={10}
                        px={6}
                        bg={cardBg}
                        borderRadius="lg"
                        shadow="sm"
                    >
                        <Text fontSize="6xl" mb={4}>
                            😢
                        </Text>
                        <Heading as="h2" size="xl" mb={4} color={headingColor}>
                            No products found
                        </Heading>
                        <Text color={textColor}>There are no products available at the moment.</Text>
                        <Button mt={6} colorScheme="teal" onClick={openAddProductModal}>
                            Add Your First Product
                        </Button>
                    </Flex>
                ) : (
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
                        {products.map((product) => (
                            <Box
                                key={product._id}
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                bg={cardBg}
                                borderColor={borderColor}
                                transition="transform 0.3s"
                                _hover={{ transform: "translateY(-5px)", shadow: "md" }}
                            >
                                <Image
                                    src={product.imageURL || "/placeholder.svg?height=200&width=300"}
                                    alt={product.name}
                                    height="200px"
                                    width="100%"
                                    objectFit="cover"
                                    fallback={
                                        <Box
                                            height="200px"
                                            width="100%"
                                            bg="gray.200"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Text color="gray.500">No Image</Text>
                                        </Box>
                                    }
                                />
                                <Box p={5}>
                                    <Heading size="md" my={2} color={headingColor} noOfLines={1}>
                                        {product.name}
                                    </Heading>
                                    <Text color="teal.600" fontSize="2xl" fontWeight="bold">
                                        ${typeof product.price === "number" ? product.price.toFixed(2) : product.price}
                                    </Text>
                                </Box>
                            </Box>
                        ))}
                    </SimpleGrid>
                )}

                {/* Add Product Modal */}
                <Modal isOpen={isAddProductModal} onClose={closeAddProductModal} size="lg">
                    <ModalOverlay />
                    <ModalContent bg={cardBg}>
                        <ModalHeader color={headingColor}>Add New Product</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <form id="add-product-form" onSubmit={handleSubmit}>
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

                                    <FormControl>
                                        <FormLabel color={headingColor}>Image URL</FormLabel>
                                        <Input
                                            name="imageURL"
                                            value={formData.imageURL}
                                            onChange={handleInputChange}
                                            placeholder="Enter image URL"
                                            bg={inputBg}
                                            borderColor={borderColor}
                                        />
                                        <FormHelperText color={textColor}>
                                            Provide a URL to an image of your product (optional).
                                        </FormHelperText>
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
                            <Button
                                variant="outline"
                                mr={3}
                                onClick={() => {
                                    resetForm()
                                    closeAddProductModal()
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                form="add-product-form"
                                colorScheme="teal"
                                isLoading={isSubmitting}
                                loadingText="Adding..."
                            >
                                Add Product
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Container>
        </Box>
    )
}

export default Home
