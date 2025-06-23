import { Route, Routes } from "react-router";

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
import ErrorBoundary from "./components/ErrorBoundary";
import AdminPanel from "./components/admin/AdminPanel";
import ProductDetails from "./components/product-details/ProductDetails";
import Cart from "./components/cart/Cart";
import Checkout from "./components/checkout/Checkоut";
import ThankYouPage from "./components/thank-you/ThankYouPage";
import ScrollToTop from "./components/ScrollToTop";
import EmailConfirmed from "./components/email-confirm/EmailConfirmed";
import EmailAlreadyConfirmed from "./components/email-confirm/EmailAlreadyConfirmed";
import EmailConfirmationError from "./components/email-confirm/EmailConfirmationError";
import CheckEmail from "./components/email-confirm/CheckEmail";
import PrivateRoute from "./components/guards/PrivateRoute";
import GuestRoute from "./components/guards/GuestRoute";
import NotFound from "./components/NotFound";

function App() {
  return (
    <div className="relative pt-[64px] min-h-screen">
      <Header />
      <ErrorBoundary>
        <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/thank-you" element={<ThankYouPage />} />

          {/* Guest only routes */}

          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
          <Route
            path="/confirm-email"
            element={
              <GuestRoute>
                <EmailConfirmed />
              </GuestRoute>
            }
          />
          <Route
            path="/email-confirmed"
            element={
              <GuestRoute>
                <EmailConfirmed />
              </GuestRoute>
            }
          />
          <Route
            path="/email-already-confirmed"
            element={
              <GuestRoute>
                <EmailAlreadyConfirmed />
              </GuestRoute>
            }
          />
          <Route
            path="/email-error"
            element={
              <GuestRoute>
                <EmailConfirmationError />
              </GuestRoute>
            }
          />
          <Route
            path="/check-email"
            element={
              <GuestRoute>
                <CheckEmail />
              </GuestRoute>
            }
          />

          {/* Protected routes */}

          <Route
            path="/profile/*"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <PrivateRoute requireAdmin>
                <AdminPanel />
              </PrivateRoute>
            }
          />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
      <Footer />
    </div>
  );
}

export default App;
