import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "./context/CartContext";
import AuthProvider from "./context/AuthContext";

import Header from "./components/header/Header";
import Home from "./components/home/Home";
import Catalog from "./components/catalog/Catalog";
import Footer from "./components/footer/Footer";
import About from "./components/footer/about/About";
import Contact from "./components/footer/contact/Contact";
import Privacy from "./components/footer/privacy/Privacy";
import Terms from "./components/footer/terms/Terms";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Profile from "./components/profile/Profile";
import PrivateRoute from "./components/private-router/PrivateRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import AdminRoute from "./components/private-router/AdminRoute";
import AdminPanel from "./components/admin/AdminPanel";
import ProductDetails from "./components/product-details/ProductDetails";
import Cart from "./components/cart/Cart";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div>
          <Header />
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/catalog/:id" element={<ProductDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            </Routes>
          </ErrorBoundary>
          <Footer />
        </div>
        <ToastContainer position="top-center" autoClose={3000} />
      </CartProvider>
    </AuthProvider >
  );
}

export default App;
