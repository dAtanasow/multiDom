import { useState } from "react";
import { toast } from "sonner";
import orderApi from "../../../api/order";
import ConfirmModal from "../../ConfirmModal";

export default function OrderCard({ order, isOpen, onToggle, onStatusChange }) {
    const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

    const handleStatusChange = async (newStatus) => {
        try {
            const response = await orderApi.updateOrderStatus(order._id, newStatus);
            console.log("orderApi.updateOrderStatus response", response);
            toast.success("Статусът е обновен!");
            if (onStatusChange) onStatusChange(order._id, newStatus);
        } catch (err) {
            toast.error("Грешка при обновяване на статуса.");
            console.error(err);
        }
    };


    const totalPrice = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const statusBadge = {
        new: "bg-blue-100 text-blue-800",
        pending: "bg-yellow-100 text-yellow-800",
        completed: "bg-green-100 text-green-800",
        canceled: "bg-red-100 text-red-800",
    };

    return (
        <div className="p-3 border-b bg-white relative text-sm cursor-pointer" onClick={onToggle}>
            <span className="absolute top-2 left-3 text-base text-blue-700 font-mono">
                {order.orderNumber || order._id.slice(-6)}
            </span>

            <div className="flex flex-col items-center justify-center text-center mt-4">
                <p className="font-semibold text-gray-800">{order.name}</p>
                <span className="text-blue-700 text-sm">+{order.phone}</span>
            </div>

            <div className="flex justify-between items-end text-xs text-gray-500">
                <div className="flex flex-col leading-tight">
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                    <span className={`px-2 py-1 rounded-full text-[10px] ${statusBadge[order.status]}`}>
                        {order.status === "new" ? "нова" :
                            order.status === "pending" ? "чакаща" :
                                order.status === "completed" ? "приключена" : "отказана"}
                    </span>
                    <div className="flex gap-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(order.status === 'pending' ? 'completed' : 'pending');
                            }}
                            className="text-[11px] px-1.5 py-1 rounded bg-gray-100 hover:bg-gray-200"
                        >
                            {order.status === 'pending' ? '✅' : '⏳'}
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setConfirmCancelOpen(true);
                            }}
                            className="text-[11px] px-1.5 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200"
                        >
                            ❌
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="text-sm sm:text-base text-gray-500 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-gray-500 mb-1 font-medium">Доставка</h4>
                        <p>Град: <span className="font-semibold text-gray-800">{order.city}</span></p>
                        <p>Адрес: <span className="font-semibold text-gray-800">{order.address || `${order.office.name}, ${order.office.address}`}</span></p>
                        <p>Метод: <span className="font-semibold text-gray-800">{order.address ? "Личен адрес" : "Офис на куриер"}</span></p>
                        <p>Куриер: <span className="font-semibold text-gray-800">{order.office?.courierName}</span></p>
                        <p>Имейл: <span className="font-semibold text-gray-800">{order.email}</span></p>
                        <p>Коментар: <span className="font-semibold text-gray-800">{order.comment || "—"}</span></p>
                    </div>

                    {order.invoice?.useInvoice && (
                        <div>
                            <p>Фактура №: <span className="font-semibold text-gray-800">{order.invoice.orderNumber}</span></p>
                            <p>Фирма: <span className="font-semibold text-gray-800">{order.invoice.companyName} {order.invoice.companyType}</span></p>
                            <p>ЕИК: <span className="font-semibold text-gray-800">{order.invoice.vatId}</span></p>
                            <p>МОЛ: <span className="font-semibold text-gray-800">{order.invoice.mol}</span></p>
                            <p>Адрес: <span className="font-semibold text-gray-800">{order.invoice.companyAddress}</span></p>
                        </div>
                    )}

                    <div>
                        <h4 className="text-gray-500 mb-1 font-medium">Продукти</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {order.items.map((item, i) => (
                                <li key={i}>
                                    <span className="font-semibold text-gray-800">{item.name}</span> — {item.quantity} × {item.price} лв
                                </li>
                            ))}
                        </ul>
                        <div className="mt-2 text-right font-bold text-gray-800">
                            Общо: {totalPrice.toFixed(2)} лв
                        </div>
                    </div>
                </div>
            )}

            {confirmCancelOpen && (
                <ConfirmModal
                    title="Потвърждение"
                    message="Сигурни ли сте, че искате да откажете тази поръчка?"
                    onCancel={() => setConfirmCancelOpen(false)}
                    onConfirm={() => {
                        handleStatusChange("canceled");
                        setConfirmCancelOpen(false);
                    }}
                />
            )}
        </div>
    );
}