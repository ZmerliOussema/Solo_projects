import { ChakraProvider, ColorModeScript } from "@chakra-ui/react"
import theme from "./assets/theme"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import ProductDetails from "./components/ProductDetails"
import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/:id" element={<ProductDetails/>}/>    
        </Routes>
      </main>
    </ChakraProvider>
  )
}

export default App
