import { useState, useRef, useEffect } from "react";
import { useOrders } from "../../../hooks/useOrders";
import OrderCard from "./OrderCard";
import GenericSearch from "../../search/GenericSearch";
import SpinnerLoader from "../../SpinnerLoader";

export default function Orders({ status }) {
    const [openOrderId, setOpenOrderId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const topRef = useRef(null);

    const {
        newOrders, pendingOrders, completedOrders, canceledOrders,
        isLoading, error, updateOrderStatusLocal
    } = useOrders();

    const getOrders = () => {
        switch (status) {
            case "new": return newOrders;
            case "pending": return pendingOrders;
            case "completed": return completedOrders;
            case "canceled": return canceledOrders;
            default: return [];
        }
    };

    const allOrders = getOrders();

    useEffect(() => {
        if (topRef.current) {
            window.scrollTo({ top: topRef.current.offsetTop - 80, behavior: "smooth" });
        }
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    if (isLoading) return <SpinnerLoader />;
    if (error) return <p>{error}</p>;

    return (
        <div className="w-full max-w-5xl mx-auto px-2" ref={topRef}>
            <GenericSearch data={allOrders} keys={["name", "orderNumber"]} term={searchTerm}>
                {(filteredOrders) => {
                    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

                    return (
                        <>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                                <div className="w-full sm:w-auto">
                                    <input
                                        type="text"
                                        placeholder="Търси по име или номер..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="px-4 py-2 border rounded-xl border-gray-300 focus:outline-none w-full sm:w-[300px] text-sm"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="text-sm text-gray-600">На страница:</label>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        className="border text-sm rounded px-2 py-1"
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                {paginatedOrders.map(order => (
                                    <OrderCard
                                        key={order._id}
                                        order={order}
                                        isOpen={openOrderId === order._id}
                                        onToggle={() => setOpenOrderId(prev => (prev === order._id ? null : order._id))}
                                        onStatusChange={updateOrderStatusLocal}
                                    />
                                ))}
                            </div>

                            {filteredOrders.length === 0 && (
                                <p className="text-center text-sm text-gray-500 mt-4">Няма съвпадения</p>
                            )}

                            {totalPages > 1 && (
                                <div className="flex justify-center mt-4 flex-wrap gap-2">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                                    >
                                        Назад
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1 rounded border text-sm ${currentPage === page
                                                ? "bg-blue-600 text-white"
                                                : "hover:bg-gray-100"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                                    >
                                        Напред
                                    </button>
                                </div>
                            )}
                        </>
                    );
                }}
            </GenericSearch>
        </div>
    );
}
