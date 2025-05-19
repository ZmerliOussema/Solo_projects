"use client"
import {
    Box,
    Container,
    Heading,
    Text,
    Image,
    Button,
    Flex,
    Stack,
    useColorModeValue,
    Divider,
    HStack,
    Icon,
} from "@chakra-ui/react"
import { Link, useParams } from "react-router-dom"
import { useEffect } from "react"
import axios from "axios"

const ProductDetails = ({ product, onEdit, onBack }) => {
    const {id} = useParams()
    // Color values based on color mode
    //   const bgColor = useColorModeValue("gray.50", "gray.900")
    const cardBg = useColorModeValue("white", "gray.700")
    const textColor = useColorModeValue("gray.600", "gray.200")
    const headingColor = useColorModeValue("gray.800", "white")
    const borderColor = useColorModeValue("gray.200", "gray.600")

    useEffect(()=>{
        axios.get(`http://localhost:8000/api/products/${id}`)
            .then(response=>{
                console.log(response.data.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }, []);

    if (!product) {
        return (
            <Container maxW="container.lg" py={8}>
                <Box textAlign="center" py={10} px={6}>
                    <Heading as="h2" size="xl" mt={6} mb={2}>
                        Product Not Found
                    </Heading>
                    <Text color={"gray.500"}>The product you are looking for does not exist or has been removed.</Text>
                    <Link to={"/"}>
                    <Button
                        mt={6}
                        colorScheme="teal"
                        onClick={onBack}
                        leftIcon={
                            <Icon viewBox="0 0 24 24" boxSize={4}>
                                <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                            </Icon>
                        }
                    >
                        Back to Products
                    </Button>
                    </Link>
                    
                </Box>
            </Container>
        )
    }

    return (
        <Container maxW="container.lg" py={8}>
            <Button
                mb={8}
                leftIcon={
                    <Icon viewBox="0 0 24 24" boxSize={4}>
                        <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </Icon>
                }
                onClick={onBack}
                variant="outline"
            >
                Back to Products
            </Button>

            <Flex
                direction={{ base: "column", md: "row" }}
                bg={cardBg}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                borderWidth="1px"
                borderColor={borderColor}
            >
                <Box width={{ base: "100%", md: "50%" }} position="relative">
                    <Image
                        src={product.imageURL || "/placeholder.svg?height=400&width=600"}
                        alt={product.name}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        fallback={
                            <Box
                                height="100%"
                                width="100%"
                                bg="gray.200"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                minHeight="400px"
                            >
                                <Text color="gray.500">No Image</Text>
                            </Box>
                        }
                    />
                </Box>

                <Box p={8} width={{ base: "100%", md: "50%" }}>
                    <Stack spacing={4}>
                        <Heading as="h1" size="xl" color={headingColor}>
                            {product.name}
                        </Heading>

                        <Text color="teal.600" fontSize="3xl" fontWeight="bold">
                            ${typeof product.price === "number" ? product.price.toFixed(2) : product.price}
                        </Text>

                        <Divider />

                        <Text color={textColor} fontSize="lg">
                            {product.description || "No description available for this product."}
                        </Text>

                        <Divider />

                        <HStack spacing={4}>
                            <Button
                                colorScheme="teal"
                                size="lg"
                                leftIcon={
                                    <Icon viewBox="0 0 24 24" boxSize={5}>
                                        <path
                                            fill="currentColor"
                                            d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"
                                        />
                                    </Icon>
                                }
                            >
                                Add to Cart
                            </Button>
                            <Button
                                variant="outline"
                                colorScheme="blue"
                                leftIcon={
                                    <Icon viewBox="0 0 24 24" boxSize={5}>
                                        <path
                                            fill="currentColor"
                                            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                                        />
                                    </Icon>
                                }
                                onClick={() => onEdit(product)}
                            >
                                Edit Product
                            </Button>
                        </HStack>
                    </Stack>
                </Box>
            </Flex>
        </Container>
    )
}

export default ProductDetails
