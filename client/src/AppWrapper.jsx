import AuthProvider from "./context/AuthContext";
import CartProvider from "./context/CartContext";
import App from "./App";

export default function AppWrapper() {
    return (
        <AuthProvider>
            <CartProvider>
                <App />
            </CartProvider>
        </AuthProvider>
    );
}
