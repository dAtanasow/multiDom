import { useNavigate } from "react-router";
import { useForm } from "./useForm";
import { deliveryPrices } from "../constants/deliveryPrices";
import orderApi from "../api/order";
import { useMemo } from "react";
import { toast } from "react-toastify";

export function useCheckoutForm(cart, clearCart) {
    const navigate = useNavigate();

    const initialValues = useMemo(() => ({
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
    }), []);

    return useForm(initialValues, async (form) => {
        const { deliveryCompany, deliveryMethod } = form;
        const methodPrice = deliveryPrices[deliveryCompany]?.[deliveryMethod];
        const deliveryTotal = typeof methodPrice === 'number' ? methodPrice : 0;

        if (!deliveryCompany || !deliveryMethod || deliveryTotal === 0) {
            return toast.info("Моля, изберете метод и доставчик, за да се изчисли цената.");
        }

        const payload = {
            ...form,
            deliveryTotal,
            address: deliveryMethod === "office"
                ? form.office?.address
                : form.address,
            items: cart.map(item => ({
                productId: item._id,
                name: item.name,
                price: item.discountPrice && item.discountPrice < item.price
                    ? item.discountPrice
                    : item.price,
                originalPrice: item.price,
                discountPrice: item.discountPrice,
                quantity: item.quantity,
                images: item.images
            }))
        };

        try {
            await orderApi.createOrder(payload);
            clearCart();
            navigate("/thank-you");
        } catch (err) {
            console.error("❌ Грешка при изпращане на поръчка:", err);
        }
    });

}