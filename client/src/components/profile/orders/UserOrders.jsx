import { useState } from "react";
import { useUserOrders } from "../../../hooks/useUserOrders";
import OrderProductCard from "./OrdersProductCard";
import SpinnerLoader from "../../SpinnerLoader";
import { ChevronDown } from "lucide-react";

export default function UserOrders() {
    const { orders, loading } = useUserOrders();
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    if (loading) return <SpinnerLoader />
    if (orders.length === 0) return <p className="text-center py-20 text-gray-500">Нямате направени поръчки.</p>;

    const toggleExpand = (id) => {
        setExpandedOrderId(prev => (prev === id ? null : id));
    };

    const statusMap = {
        new: { text: "Нова", color: "bg-yellow-100 text-yellow-700" },
        pending: { text: "Чакаща", color: "bg-blue-100 text-blue-700" },
        completed: { text: "Завършена", color: "bg-green-100 text-green-700" },
        canceled: { text: "Отказана", color: "bg-red-100 text-red-700" },
    };

    return (
        <div className="space-y-3">
            {orders.map(order => {
                const totalStandard = order.items.reduce(
                    (sum, item) => sum + ((item.originalPrice ?? item.price ?? 0) * item.quantity), 0
                );

                const total = order.items.reduce(
                    (sum, item) => sum + ((item.discountPrice ?? item.price ?? 0) * item.quantity), 0
                );

                const discount = totalStandard - total;
                const delivery = order.deliveryTotal || 0;
                const grandTotal = total + delivery;
                const status = statusMap[order.status] || { text: order.status, color: "bg-gray-100 text-gray-600" };

                return (
                    <div
                        key={order._id}
                        className="rounded-3xl border border-gray-200 shadow-md hover:shadow-xl transition-all bg-gradient-to-br from-white via-slate-50 to-white overflow-hidden"
                    >
                        <div
                            onClick={() => toggleExpand(order._id)}
                            className="cursor-pointer p-6 flex justify-between items-center hover:bg-slate-100 transition-colors"
                        >
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-800">Поръчка № {order.orderNumber}</h3>
                                <p className="text-sm text-gray-500">Дата: {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p className="text-sm">
                                    Статус:
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.text}</span>
                                </p>
                                <p className="text-sm text-slate-700">
                                    Платена сума: <span className="font-semibold text-slate-900">{(order.total || grandTotal).toFixed(2)} лв.</span>
                                </p>
                            </div>
                            <ChevronDown
                                className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${expandedOrderId === order._id ? "rotate-180" : "rotate-0"
                                    }`}
                            />
                        </div>

                        {expandedOrderId === order._id && (
                            <div className="border-t bg-white p-6 space-y-6">
                                {order.office?.name ? (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 shadow-sm">
                                        <strong>Офис на {order.office.courierName?.toUpperCase()}:</strong> {order.office.name}, {order.office.address}
                                    </div>
                                ) : order.address ? (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 shadow-sm">
                                        <strong>Адрес за доставка:</strong> {order.address}
                                    </div>
                                ) : null}

                                <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {order.items.map(item => (
                                        <li key={item._id} className="h-full">
                                            <OrderProductCard product={item} />
                                        </li>
                                    ))}
                                </ul>

                                <div className="bg-gradient-to-br from-white via-slate-50 to-white p-4 rounded-xl border border-slate-200 text-sm space-y-1 shadow-sm">
                                    <p><strong>Стандартна стойност:</strong> {totalStandard.toFixed(2)} лв.</p>
                                    <p className={discount > 0 ? "text-green-600 font-medium" : ""}>
                                        <strong>Отстъпка:</strong> -{discount.toFixed(2)} лв.
                                    </p>
                                    <p><strong>Доставка:</strong> {delivery.toFixed(2)} лв.</p>
                                    <p className="font-semibold text-base pt-2 border-t border-gray-200">
                                        <strong>Обща стойност:</strong> {grandTotal.toFixed(2)} лв.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}