import { useState } from "react";
import { useOrders } from "../../../hooks/useOrders";
import OrderCard from "./OrderCard.";

export default function Orders({ status }) {
    const [openOrderId, setOpenOrderId] = useState(null);
    const { newOrders, pendingOrders, completedOrders, canceledOrders, isLoading, error, updateOrderStatusLocal } = useOrders();

    if (isLoading) return <p>Зареждане...</p>;
    if (error) return <p>{error}</p>;

    const getOrders = () => {
        switch (status) {
            case "new":
                return newOrders;
            case "pending":
                return pendingOrders;
            case "completed":
                return completedOrders;
            case "canceled":
                return canceledOrders;
            default:
                return [];
        }
    };

    return (
        <div className="space-y-4">
            {getOrders().map(order => (
                <OrderCard
                    key={order._id}
                    order={order}
                    isOpen={openOrderId === order._id}
                    onToggle={() => setOpenOrderId(prev => (prev === order._id ? null : order._id))}
                    onStatusChange={updateOrderStatusLocal}
                />
            ))}
        </div>
    );
}
