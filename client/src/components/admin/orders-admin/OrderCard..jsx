import { useState } from "react";
import { toast } from "react-toastify";
import orderApi from "../../../api/order";
import { FiMoreVertical } from "react-icons/fi";
import ConfirmModal from "../../ConfirmModal";

export default function OrderCard({ order, isOpen, onToggle, onStatusChange }) {
    const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

    const handleStatusChange = async (newStatus) => {
        try {
            await orderApi.updateOrderStatus(order._id, newStatus);
            toast.success("Статусът е обновен!");
            if (onStatusChange) onStatusChange(order._id, newStatus);
        } catch (err) {
            toast.error("Грешка при обновяване на статуса.");
            console.error(err);
        }
    };

    return (
        <div className="relative z-10 border-t-1 bg-white hover:shadow-md transition-shadow duration-300 overflow:visible">
            <div
                className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-2xl"
                onClick={onToggle}
            >
                <div className="p-4 flex justify-between items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-2xl">
                    <div className="flex-1 min-w-0">
                        <div className="text-base font-semibold truncate">
                            {order.name} — {order.phone}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                            {order.city}, {new Date(order.createdAt).toLocaleString()}
                        </div>
                    </div>

                    <div className="relative w-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                            {order.status === "pending" ? (
                                <button
                                    onClick={() => handleStatusChange("completed")}
                                    className="text-green-600 hover:text-green-800"
                                    title="Приключи"
                                >
                                    ✅
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleStatusChange("pending")}
                                    className="text-yellow-600 hover:text-yellow-800"
                                    title="Чакаща"
                                >
                                    ⏳
                                </button>
                            )}

                            <button
                                onClick={() => setConfirmCancelOpen(true)}
                                className="text-red-600 hover:text-red-800"
                                title="Откажи"
                            >
                                ❌
                            </button>

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

                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="px-4 pb-4 text-sm md:text-base text-start text-gray-700">
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="md:mt-5">
                            {order.office?.courierName && (
                                <div><strong>Куриер:</strong> {order.office.courierName}</div>
                            )}
                            <div><strong>Адрес:</strong> {
                                order.address
                                ? order.address
                                : order.office?.address
                                ? `${order.office.name} — ${order.office.address}`
                                : "—"
                            }</div>
                            <div><strong>Доставка до:</strong> {order.address ? "Личен адрес" : "Офис на куриер"}</div>
                            <div><strong>Имейл:</strong> {order.email}</div>
                            <div><strong>Коментар:</strong> {order.comment || "—"}</div>
                        </div>
                        {order.invoice?.useInvoice && (
                            <div className="md:mt-5">
                                <div><strong>Фирма:</strong> {order.invoice.companyName}</div>
                                <div><strong>МОЛ:</strong> {order.invoice.mol}</div>
                                <div><strong>ДДС №:</strong> {order.invoice.vatNumber}</div>
                                <div><strong>Булстат:</strong> {order.invoice.bulstat}</div>
                            </div>
                        )}

                        <div className="">
                            <strong>Продукти:</strong>
                            <ul className="space-y-1">
                                {order.items.map((item, i) => (
                                    <li key={i}>
                                        {item.name} — {item.quantity} x {item.price} лв
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
}
