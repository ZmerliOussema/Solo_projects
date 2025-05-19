"use client"
import { useEffect } from "react"
import { useProductStore } from "../store/product"
import useUIStore from "../store/ui"
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
    IconButton,
    HStack,
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Icon, // Import Icon component
} from "@chakra-ui/react"
import ProductFormModal from "../components/ProductFormModal"
import { useRef, useState } from "react"
import {useNavigate} from 'react-router-dom'; 

const Home = () => {
    const { getProducts, products, addProduct, updateProduct, deleteProduct } = useProductStore()
    const {
        isAddProductModalOpen,
        openAddProductModal,
        closeAddProductModal,
        isEditProductModalOpen,
        productToEdit,
        openEditProductModal,
        closeEditProductModal,
    } = useUIStore()
    const navigate = useNavigate();

    // For delete confirmation dialog
    const [productToDelete, setProductToDelete] = useState(null)
    const { isOpen: isDeleteDialogOpen, onOpen: openDeleteDialog, onClose: closeDeleteDialog } = useDisclosure()
    const cancelRef = useRef()

    // Fetch all available products
    useEffect(() => {
        getProducts()
    }, [getProducts])

    // Color values based on color mode
    const bgColor = useColorModeValue("gray.50", "gray.900")
    const cardBg = useColorModeValue("white", "gray.700")
    const textColor = useColorModeValue("gray.600", "gray.200")
    const headingColor = useColorModeValue("gray.800", "white")
    const borderColor = useColorModeValue("gray.200", "gray.600")
    //   const buttonBgLight = useColorModeValue("gray.100", "gray.600")
    const buttonBgHover = useColorModeValue("gray.200", "gray.500")

    // Handle product card click - navigate to details page
    const handleProductClick = (product) => {
        
        console.log("Navigate to product details page for:", product._id);
        navigate(`/${product._id}`);
    }

    // Handle edit button click
    const handleEditClick = (e, product) => {
        e.stopPropagation() // Prevent card click from triggering
        openEditProductModal(product)
    }

    // Handle delete button click
    const handleDeleteClick = (e, product) => {
        e.stopPropagation() // Prevent card click from triggering
        setProductToDelete(product)
        openDeleteDialog()
    }

    // Confirm product deletion
    const confirmDelete = () => {
        if (productToDelete && typeof deleteProduct === "function") {
            deleteProduct(productToDelete._id)

            // Show toast notification (if you have toast setup)
            // toast({
            //   title: "Product deleted",
            //   description: "The product has been successfully deleted.",
            //   status: "success",
            //   duration: 5000,
            //   isClosable: true,
            // })
        }
        closeDeleteDialog()
        setProductToDelete(null)
    }

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
                            <Box
                                key={product._id}
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                bg={cardBg}
                                borderColor={borderColor}
                                transition="transform 0.3s, box-shadow 0.3s"
                                _hover={{ transform: "translateY(-5px)", shadow: "md" }}
                                cursor="pointer"
                                onClick={() => handleProductClick(product)}
                                position="relative"
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

                                    {/* Action buttons */}
                                    <HStack mt={4} spacing={2} justifyContent="flex-end">
                                        <IconButton
                                            aria-label="Edit product"
                                            icon={
                                                <Icon viewBox="0 0 24 24" boxSize={5}>
                                                    <path
                                                        fill="currentColor"
                                                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                                                    />
                                                </Icon>
                                            }
                                            size="sm"
                                            colorScheme="blue"
                                            variant="ghost"
                                            onClick={(e) => handleEditClick(e, product)}
                                            _hover={{ bg: buttonBgHover }}
                                        />
                                        <IconButton
                                            aria-label="Delete product"
                                            icon={
                                                <Icon viewBox="0 0 24 24" boxSize={5}>
                                                    <path
                                                        fill="currentColor"
                                                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                                                    />
                                                </Icon>
                                            }
                                            size="sm"
                                            colorScheme="red"
                                            variant="ghost"
                                            onClick={(e) => handleDeleteClick(e, product)}
                                            _hover={{ bg: buttonBgHover }}
                                        />
                                    </HStack>
                                </Box>
                            </Box>
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

                {/* Delete Confirmation Dialog */}
                <AlertDialog isOpen={isDeleteDialogOpen} leastDestructiveRef={cancelRef} onClose={closeDeleteDialog}>
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                Delete Product
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Are you sure you want to delete this product? This action cannot be undone.
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={closeDeleteDialog}>
                                    Cancel
                                </Button>
                                <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                                    Delete
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </Container>
        </Box>
    )
}

export default Home
