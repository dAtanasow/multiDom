import DeliveryCompanySelector from "./DeliveryCompanySelector";
import DeliveryMethod from "./DeliveryMethod";
import OfficeListbox from "./OfficeListbox";

export default function DeliveryOptions({
    form,
    setValues,
    setDeliveryCompany,
    deliveryMethod,
    setDeliveryMethod,
    offices,
    loadingOffices,
    selectedOfficeId,
    setSelectedOfficeId,
    changeHandler,
    deliveryPrices,
}) {
    const handleCompanyChange = (company) => {
        setValues((prev) => ({
            ...prev,
            deliveryCompany: company,
            office: null,
            address: prev.deliveryMethod === "address" ? prev.address : "",
        }));

        setDeliveryCompany(company);
    };

    const handleMethodChange = (method) => {
        setDeliveryMethod(method);
        setValues((prev) => ({ ...prev, deliveryMethod: method }));
    };


    return (
        <>
            {(form.city || form.deliveryMethod) && (
                <DeliveryCompanySelector
                    selectedCompany={form.deliveryCompany}
                    onChange={handleCompanyChange}
                    disabled={!form.city && !form.deliveryMethod}
                    deliveryPrices={deliveryPrices}
                />
            )}

            {form.deliveryCompany && (
                <DeliveryMethod
                    deliveryMethod={deliveryMethod}
                    setDeliveryMethod={setDeliveryMethod}
                    onChange={handleMethodChange}
                />
            )}

            {form.deliveryCompany && deliveryMethod === "office" && (
                <div>
                    <label className="block text-sm font-medium mb-1">Избери офис</label>
                    {loadingOffices ? (
                        <p className="text-sm text-gray-500">Зареждане на офиси...</p>
                    ) : offices.length > 0 ? (
                        <OfficeListbox
                            key={selectedOfficeId}
                            offices={offices}
                            selectedOfficeId={selectedOfficeId}
                            setSelectedOfficeId={setSelectedOfficeId}
                        />
                    ) : (
                        <p className="text-sm text-red-600">Няма налични офиси за избрания град.</p>
                    )}
                </div>
            )}

            {deliveryMethod === "address" && (
                <div>
                    <label className="block text-sm font-medium mb-1">Адрес за доставка</label>
                    <textarea
                        name="address"
                        value={form.address || ""}
                        onChange={changeHandler}
                        required
                        className="w-full border p-2 rounded"
                        rows={3}
                    />
                </div>
            )}
        </>
    );
}
