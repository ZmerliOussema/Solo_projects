"use client"
import { useEffect } from "react"
import { useProductStore } from "../store/product"
import { Box, Container, Heading, Text, SimpleGrid, useColorModeValue, Flex, Image } from "@chakra-ui/react"

const Home = () => {
  const { getProducts, products } = useProductStore()

  // Fetch all available products
  useEffect(() => {
    getProducts()
  }, [getProducts]) // It will re-render on every change of products.

  // Color values based on color mode
  const bgColor = useColorModeValue("gray.50", "gray.900")
  const cardBg = useColorModeValue("white", "gray.700")
  const textColor = useColorModeValue("gray.600", "gray.200")
  const headingColor = useColorModeValue("gray.800", "white")
  const borderColor = useColorModeValue("gray.200", "gray.600")

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
      </Container>
    </Box>
  )
}

export default Home
