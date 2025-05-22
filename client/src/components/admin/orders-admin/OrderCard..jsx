import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import orderApi from "../../../api/order";
import { FiMoreVertical } from "react-icons/fi";
import ConfirmModal from "../../ConfirmModal";

export default function OrderCard({ order, isOpen, onToggle, onStatusChange }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
    const menuRef = useRef();

    const handleStatusChange = async (newStatus) => {
        setIsUpdating(true);
        try {
            await orderApi.updateOrderStatus(order._id, newStatus);
            toast.success("Статусът е обновен!");
            if (onStatusChange) onStatusChange(order._id, newStatus);
            setMenuOpen(false);
        } catch (err) {
            toast.error("Грешка при обновяване на статуса.");
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative z-10 border rounded-2xl shadow-sm bg-white hover:shadow-md transition-shadow duration-300 overflow-visible">
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
                        <button onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(prev => !prev);
                        }}
                            className="text-gray-500 hover:text-black">
                            <FiMoreVertical size={20} />
                        </button>

                        {menuOpen && (
                            <div
                                ref={menuRef}
                                className="absolute right-0 top-8 w-40 bg-white border rounded-xl shadow-lg z-50 animate-fade-in overflow-hidden"
                            >
                                {order.status === "pending" ? (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStatusChange("completed");
                                            }}
                                            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                                        >
                                            ✅ Приключена
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStatusChange("pending");
                                            }}
                                            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                                        >
                                            ⏳ Чакаща
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setConfirmCancelOpen(true);
                                    }}
                                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    ❌ Откажи
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
                        )}

                    </div>
                </div>
            </div>

            {
                isOpen && (
                    <div className="px-4 pb-4 text-sm md:text-base text-gray-700 space-y-2">
                        <div><strong>Имейл:</strong> {order.email}</div>
                        <div>
                            <strong>Адрес:</strong>{" "}
                            {order.address
                                ? order.address
                                : order.office?.address
                                    ? `${order.office.name} — ${order.office.address}`
                                    : "—"}
                        </div>
                        {order.office?.courierName && (
                            <div><strong>Куриер:</strong> {order.office.courierName}</div>
                        )}

                        <div><strong>Коментар:</strong> {order.comment || "—"}</div>

                        {order.invoice?.useInvoice && (
                            <>
                                <div><strong>Фирма:</strong> {order.invoice.companyName}</div>
                                <div><strong>МОЛ:</strong> {order.invoice.mol}</div>
                                <div><strong>ДДС №:</strong> {order.invoice.vatNumber}</div>
                                <div><strong>Булстат:</strong> {order.invoice.bulstat}</div>
                            </>
                        )}

                        <div><strong>Продукти:</strong></div>
                        <ul className="list-disc pl-5 space-y-1">
                            {order.items.map((item, i) => (
                                <li key={i}>
                                    {item.name} — {item.quantity} x {item.price} лв
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </div >
    );
}
