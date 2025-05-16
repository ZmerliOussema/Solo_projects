"use client"
import { useEffect } from "react"
import { useProductStore } from "../store/product"
import useUIStore from "../store/ui.js"
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    useColorModeValue,
    Flex,
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
} from "@chakra-ui/react"
import ProductCard from "../components/ProductCard"
import AddProductModal from "../components/AddProductModal"
import EditProductModal from "../components/EditProductModal"
import ProductFormModal from "../components/ProductFormModal.jsx"

const Home = () => {
    const { getProducts, products, addProduct, updateProduct } = useProductStore()
    const {
        isAddProductModalOpen,
        openAddProductModal,
        closeAddProductModal,
        isEditProductModalOpen,
        closeEditProductModal,
        productToEdit
    } = useUIStore()

    // Fetch all available products
    useEffect(() => {
        getProducts()
    }, [getProducts])

    // Color values based on color mode
    const bgColor = useColorModeValue("gray.50", "gray.900")
    const cardBg = useColorModeValue("white", "gray.700")
    const textColor = useColorModeValue("gray.600", "gray.200")
    const headingColor = useColorModeValue("gray.800", "white")

    return (
        <Box bg={bgColor} minH="100vh">
            <Container maxW="container.xl" py={8}>
                <Heading as="h1" size="xl" mb={8} color={headingColor} textAlign="center" width="100%">
                    Current Products{" "}
                    <Text as="span" fontSize="3xl">
                        🚀
                    </Text>
                </Heading>
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
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </SimpleGrid>
                )}
                
                {/* Unified Product Form Modal for both Add and Edit */}
                <ProductFormModal
                    isOpen={isAddProductModalOpen}
                    onClose={closeAddProductModal}
                    mode="add"
                    onSubmit={addProduct}
                />

                <ProductFormModal
                    isOpen={isEditProductModalOpen}
                    onClose={closeEditProductModal}
                    mode="edit"
                    product={productToEdit}
                    onSubmit={updateProduct}
                />
            </Container>
        </Box>
    )
}

export default Home
