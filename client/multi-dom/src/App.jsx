import { Route, Routes } from "react-router";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import Catalog from "./components/catalog/Catalog";
import Footer from "./components/footer/Footer";
import About from "./components/footer/about/About";
import Contact from "./components/footer/contact/Contact";
import Privacy from "./components/footer/privacy/Privacy";
import Terms from "./components/footer/terms/Terms";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
