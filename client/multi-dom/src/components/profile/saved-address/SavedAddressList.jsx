export default function SavedAddressList({ addresses = [], onDelete }) {
    if (addresses.length === 0) {
        return <p className="text-sm text-gray-500">Няма запазени адреси.</p>;
    }

    return (
        <ul className="space-y-3 mb-6">
            {addresses.map((addr, i) => (
                <li
                    key={i}
                    className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex justify-between items-center"
                >
                    <div className="text-sm text-gray-700">
                        <p>
                            <span className="font-semibold text-gray-900">{addr.label}</span> —{" "}
                            {addr.deliveryMethod === "address"
                                ? addr.address
                                : (
                                    <span className="text-gray-800">
                                        {addr.office.name}, {addr.office.address}{" "}
                                        <span className="text-sm text-gray-500">
                                            ({addr.office.courierName})
                                        </span>
                                    </span>
                                )}
                        </p>
                    </div>
                    <button
                        onClick={() => onDelete(i)}
                        className="text-red-500 hover:underline text-sm font-medium"
                    >
                        Изтрий
                    </button>
                </li>
            ))}
        </ul>
    );
}
