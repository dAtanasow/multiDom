import { useNavigate } from "react-router";
import { useForm } from "./useForm";
import { deliveryPrices } from "../constants/deliveryPrices";
import orderApi from "../api/order";

export function useCheckoutForm(cart, clearCart) {
    const navigate = useNavigate();

    return useForm(
        {
            name: "",
            email: "",
            phone: "",
            city: "",
            comment: "",
            office: null,
            deliveryMethod: "",
            deliveryCompany: "",
            invoice: {
                useInvoice: false,
                companyName: "",
                bulstat: "",
                vatNumber: "",
                mol: "",
            },
            address: "",
        },
        async (form) => {
            const { deliveryCompany, deliveryMethod } = form;
            const basePrice = deliveryPrices[deliveryCompany];
            const deliveryTotal = basePrice + (deliveryMethod === "address" ? 1.5 : 0);
            
            const payload = {
                ...form,
                deliveryTotal,
                address: deliveryMethod === "office"
                    ? form.office?.address
                    : form.address,
                items: cart.map(item => ({
                    productId: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
            };

            try {
                await orderApi.createOrder(payload);
                clearCart();
                navigate("/thank-you");
            } catch (err) {
                console.error("❌ Грешка при изпращане на поръчка:", err);
            }
        }
    );
}
