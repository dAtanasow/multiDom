import { useEffect, useState } from "react";
import { toast } from "sonner";
import orderApi from "../api/order";

export function useUserOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await orderApi.getUserOrders();
                setOrders(res);
            } catch (err) {
                toast.error("Грешка при зареждане на поръчките");
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return { orders, loading };
}