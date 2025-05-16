import {
    Box,
    useColorModeValue,
    Heading,
    Text,
    Image,
    Button
} from "@chakra-ui/react"
import useUIStore from "../store/ui";
import { useProductStore } from "../store/product";

const ProductCard = ({ product }) => {
    const { openEditProductModal } = useUIStore();
    const { deleteProduct } = useProductStore();

    // Color values based on color mode
    const cardBg = useColorModeValue("white", "gray.700")
    const headingColor = useColorModeValue("gray.800", "white")
    const borderColor = useColorModeValue("gray.200", "gray.600")

    const handleDelete = () => {
        deleteProduct(product._id);
    }

    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg={cardBg}
            borderColor={borderColor}
            transition="transform 0.3s"
            _hover={{ transform: "translateY(-5px)", shadow: "md" }}
            onClick={() => openEditProductModal(product)}
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
                <Button onClick={(e) => {
                    e.stopPropagation();
                    handleDelete()
                }
                }
                >
                    delete
                </Button>
            </Box>
        </Box>
    );
}

export default ProductCard;
