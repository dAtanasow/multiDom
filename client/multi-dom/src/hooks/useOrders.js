import { useEffect, useState } from "react";
import orderApi from "../api/order";

export function useOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const result = await orderApi.getAllOrders();
                setOrders(result);
            } catch (err) {
                setError("Грешка при зареждане на поръчките.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const updateOrderStatusLocal = (id, newStatus) => {
        setOrders(prev =>
            prev.map(order =>
                order._id === id ? { ...order, status: newStatus } : order
            )
        );
    };

    const newOrders = orders.filter(o => o.status === "new");
    const pendingOrders = orders.filter(o => o.status === "pending");
    const completedOrders = orders.filter(o => o.status === "completed");
    const canceledOrders = orders.filter(o => o.status === "canceled");

    return {
        newOrders,
        pendingOrders,
        completedOrders,
        canceledOrders,
        isLoading,
        error,
        updateOrderStatusLocal
    };
}
