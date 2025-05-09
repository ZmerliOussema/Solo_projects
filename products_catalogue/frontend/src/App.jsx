import { ChakraProvider, ColorModeScript } from "@chakra-ui/react"
import theme from "./assets/theme"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Navbar />
      <main>
        <Home/>
      </main>
    </ChakraProvider>
  )
}

export default App
