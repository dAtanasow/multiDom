import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
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

function App() {
  return (
    <AuthProvider>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/catalog"
            element={
              <ErrorBoundary>
                <Catalog />
              </ErrorBoundary>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
