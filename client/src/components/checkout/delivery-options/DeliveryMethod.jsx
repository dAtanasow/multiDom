export default function DeliveryMethod({ deliveryMethod, setDeliveryMethod }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-2">Метод на доставка</label>
            <div className="flex gap-4">
                <label className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer ${deliveryMethod === "office" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}>
                    <input
                        type="radio"
                        name="deliveryMethod"
                        value="office"
                        checked={deliveryMethod === "office"}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="hidden"
                    />
                    <span className="text-sm">🏤 До офис</span>
                </label>

                <label className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer ${deliveryMethod === "address" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}>
                    <input
                        type="radio"
                        name="deliveryMethod"
                        value="address"
                        checked={deliveryMethod === "address"}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="hidden"
                    />
                    <span className="text-sm">🏠 До адрес (+1.50 лв.)</span>
                </label>
            </div>
        </div>
    );
}
