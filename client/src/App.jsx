import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";

import Header from "./components/header/Header";
import Home from "./components/home/Home";
import Catalog from "./components/catalog/Catalog";
import Footer from "./components/footer/Footer";
import About from "./components/footer/about/About";
import Contact from "./components/footer/contact/Contact";
import Privacy from "./components/footer/privacy/Privacy";
import Terms from "./components/footer/terms/Terms";
import Register from "./components/register/Register";
import Profile from "./components/profile/Profile";
import PrivateRoute from "./components/private-router/PrivateRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import AdminRoute from "./components/private-router/AdminRoute";
import AdminPanel from "./components/admin/AdminPanel";
import ProductDetails from "./components/product-details/ProductDetails";
import Cart from "./components/cart/Cart";
import Checkout from "./components/checkout/Checkоut";
import ThankYouPage from "./components/thank-you/ThankYouPage";
import ScrollToTop from "./components/ScrollToTop";


function App() {
  return (
    <div>
      <Header />
      <ErrorBoundary>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
        </Routes>
      </ErrorBoundary>
      <Footer />
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

export default App;
