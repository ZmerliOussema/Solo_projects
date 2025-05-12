"use client"
import {
    Box,
    Flex,
    Button,
    useColorMode,
    Stack,
    HStack,
    Link,
    IconButton,
    useDisclosure,
    Container,
    Icon,
} from "@chakra-ui/react"
import { useMemo } from "react"
import { useToken } from "@chakra-ui/react"
import  useUIStore  from "../store/ui"

export default function Navbar() {
    const { colorMode, toggleColorMode } = useColorMode()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { openAddProductModal } = useUIStore()

    const bgColorLight = useToken("colors", "white")
    const bgColorDark = useToken("colors", "gray.800")
    const textColorLight = useToken("colors", "gray.600")
    const textColorDark = useToken("colors", "white")

    const bgColor = useMemo(
        () => (colorMode === "light" ? bgColorLight : bgColorDark),
        [colorMode, bgColorLight, bgColorDark],
    )
    const textColor = useMemo(
        () => (colorMode === "light" ? textColorLight : textColorDark),
        [colorMode, textColorLight, textColorDark],
    )

    return (
        <Box bg={bgColor} px={4} boxShadow="sm">
            <Container maxW="container.xl">
                <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
                    <IconButton
                        size={"md"}
                        icon={
                            isOpen ? (
                                <Icon viewBox="0 0 24 24" boxSize={6}>
                                    <path
                                        fill="currentColor"
                                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                                    />
                                </Icon>
                            ) : (
                                <Icon viewBox="0 0 24 24" boxSize={6}>
                                    <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                                </Icon>
                            )
                        }
                        aria-label={"Open Menu"}
                        display={{ md: "none" }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={"center"}>
                        <Box fontWeight="bold" fontSize="lg" color={textColor}>
                            <Link href="/" _hover={{ textDecoration: "none", color: "teal.500" }}>
                                Product Store
                            </Link>
                        </Box>
                    </HStack>
                    <Flex alignItems={"center"}>
                        <Stack direction={"row"} spacing={4}>
                            <Button
                                variant={"solid"}
                                colorScheme={"teal"}
                                size={"sm"}
                                mr={4}
                                leftIcon={
                                    <Icon viewBox="0 0 24 24" boxSize={4}>
                                        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                    </Icon>
                                }
                                onClick={openAddProductModal}
                            >
                                Add Product
                            </Button>
                            <Button onClick={toggleColorMode} size={"sm"}>
                                {colorMode === "light" ? (
                                    <Icon viewBox="0 0 24 24" boxSize={5}>
                                        <path
                                            fill="currentColor"
                                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                        />
                                    </Icon>
                                ) : (
                                    <Icon viewBox="0 0 24 24" boxSize={5}>
                                        <path
                                            fill="currentColor"
                                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </Icon>
                                )}
                            </Button>
                        </Stack>
                    </Flex>
                </Flex>

                {/* Mobile menu */}
                {isOpen ? (
                    <Box pb={4} display={{ md: "none" }}>
                        <Stack as={"nav"} spacing={4}>
                            <Link
                                href="/"
                                px={2}
                                py={1}
                                rounded={"md"}
                                _hover={{
                                    textDecoration: "none",
                                    bg: colorMode === "light" ? "gray.200" : "gray.700",
                                }}
                            >
                                Product Store
                            </Link>
                            <Button
                                w="full"
                                variant={"solid"}
                                colorScheme={"teal"}
                                size={"sm"}
                                leftIcon={
                                    <Icon viewBox="0 0 24 24" boxSize={4}>
                                        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                    </Icon>
                                }
                                onClick={openAddProductModal}
                            >
                                Add Product
                            </Button>
                        </Stack>
                    </Box>
                ) : null}
            </Container>
        </Box>
    )
}
