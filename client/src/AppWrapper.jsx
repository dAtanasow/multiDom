import AuthProvider from "./context/AuthContext";
import CartProvider from "./context/CartContext";
import App from "./App";
import ToastWrapper from "./components/ToastWrapper";

export default function AppWrapper() {
    return (
        <AuthProvider>
            <CartProvider>
                <App />
                <ToastWrapper />
            </CartProvider>
        </AuthProvider>
    );
}
