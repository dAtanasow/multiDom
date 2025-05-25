import { DELIVERY_COMPANIES } from "../../../constants/deliveryCompanies";

export default function DeliveryCompanySelector({
    selectedCompany,
    onChange,
    disabled = false,
    deliveryPrices = {},
}) {
    return (
        <div>
            <label className="block text-sm font-medium mb-2">Избери доставчик</label>
            <div className="space-y-2">
                {Object.entries(deliveryPrices).map(([company, price]) => (
                    <label
                        key={company}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${selectedCompany === company
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                            }`}
                    >
                        <input
                            type="radio"
                            name="deliveryCompany"
                            value={company}
                            checked={selectedCompany === company}
                            disabled={disabled}
                            onChange={(e) => onChange(e.target.value)}
                            className="hidden"
                        />
                        <span className="text-sm font-medium">
                            {DELIVERY_COMPANIES[company]}{" "}
                            <span className="text-gray-500">
                                ({price.office.toFixed(2)} лв.)
                            </span>

                        </span>

                    </label>
                ))}
            </div>
        </div>
    );
}
