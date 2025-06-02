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
    errors,
    setError,
    submitted,
    validators,
}) {
    const handleCompanyChange = (company) => {
        setValues((prev) => ({
            ...prev,
            deliveryCompany: company,
            office: null,
            address: prev.deliveryMethod === "address" ? prev.address : "",
        }));
        setDeliveryCompany(company);

        if (errors?.deliveryCompany) {
            setError(prev => ({ ...prev, deliveryCompany: undefined }));
        }
    };


    const handleMethodChange = (method) => {
        setDeliveryMethod(method);
        setValues((prev) => ({ ...prev, deliveryMethod: method }));

        if (errors?.deliveryMethod) {
            setError(prev => ({ ...prev, deliveryMethod: undefined }));
        }
    };

    return (
        <>
            {form.city || form.deliveryMethod ? (
                <>
                    <DeliveryCompanySelector
                        selectedCompany={form.deliveryCompany}
                        onChange={handleCompanyChange}
                        disabled={!form.city && !form.deliveryMethod}
                        deliveryPrices={deliveryPrices}
                    />
                    {submitted && errors?.deliveryCompany && (
                        <p className="text-sm text-red-600 mt-1">{errors.deliveryCompany}</p>
                    )}
                </>
            ) : null}


            {form.deliveryCompany && (
                <>
                    <DeliveryMethod
                        deliveryMethod={deliveryMethod}
                        setDeliveryMethod={setDeliveryMethod}
                        onChange={handleMethodChange}
                    />
                    {submitted && errors?.deliveryMethod && (
                        <p className="text-sm text-red-600 mt-1">{errors.deliveryMethod}</p>
                    )}
                </>
            )}


            {form.deliveryCompany && deliveryMethod === "office" && (
                <div>
                    <label className="block text-sm font-medium mb-1">Избери офис</label>

                    {loadingOffices ? (
                        <p className="text-sm text-gray-500">Зареждане на офиси...</p>
                    ) : offices.length > 0 ? (
                        <>
                            <OfficeListbox
                                key={selectedOfficeId}
                                offices={offices}
                                selectedOfficeId={selectedOfficeId}
                                setSelectedOfficeId={setSelectedOfficeId}
                                onChange={changeHandler}
                                validators={validators}
                                setError={setError}
                            />
                            {submitted && errors?.office && (
                                <p className="text-sm text-red-600 mt-1">{errors.office}</p>
                            )}
                        </>
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
                        className="w-full border p-2 rounded"
                        rows={3}
                    />
                    {submitted && errors?.address && (
                        <p className="text-sm text-red-600 mt-1">{errors.address}</p>
                    )}
                </div>
            )}
        </>
    );
}
