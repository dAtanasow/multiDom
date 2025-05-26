export default function DeliveryMethod({ deliveryMethod, onChange }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-2">Метод на доставка</label>
            <div className="flex gap-4">
                <label
                    onClick={() => onChange("office")}
                    className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer ${deliveryMethod === "office" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                >
                    <span className="text-sm">🏤 До офис</span>
                </label>

                <label
                    onClick={() => onChange("address")}
                    className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer ${deliveryMethod === "address" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                >
                    <span className="text-sm">🏠 До адрес (+1.50 лв.)</span>
                </label>

            </div>
        </div>
    );
}
