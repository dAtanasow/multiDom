import { cities } from "../mock-data/office-places";
import { deliveryPrices } from "../../constants/deliveryPrices";
import { useCartContext } from "../../context/CartContext";
import { useIsMobile } from "../../hooks/useResponsive";
import { useTotals } from "../../hooks/useTotals";
import { useAuthContext } from "../../context/AuthContext";
import { useUserAddresses, useDelivery, useApplyAddressToForm } from "../../hooks/useAddress";
import { useEffect, useState } from "react";
import { useCheckoutForm } from "../../hooks/useCheckoutForm";
import CustomerInfo from "./CustomerInfo";
import SavedAddressSelect from "./SaveAddressSelect";
import DeliveryOptions from "./delivery-options/DeliveryOptions";
import InvoiceSection from "./invoice/InvoiceSection";

export default function Checkout() {
    const { cart, clearCart } = useCartContext();
    const isMobile = useIsMobile();
    const { firstName, lastName, email, phone } = useAuthContext();
    const { addresses } = useUserAddresses();
    const [selectedSavedAddress, setSelectedSavedAddress] = useState("");

    const {
        values: form,
        changeHandler,
        submitHandler,
        setValues,
    } = useCheckoutForm(cart, clearCart);

    const {
        deliveryCompany,
        setDeliveryCompany,
        deliveryMethod,
        setDeliveryMethod,
        offices,
        loadingOffices,
        selectedOfficeId,
        setSelectedOfficeId,
        selectedCity,
        handleSelectCity,
    } = useDelivery(form, setValues);

    useApplyAddressToForm({
        selectedSavedAddress,
        addresses,
        form,
        setValues,
        setSelectedOfficeId,
        selectedOfficeId,
        handleSelectCity,
        offices,
        deliveryCompany,
        loadingOffices,
    });

    const { productTotal, deliveryTotal, total } = useTotals(
        cart,
        form.deliveryCompany,
        form.deliveryMethod,
        deliveryPrices
    );

    useEffect(() => {
        if (firstName && lastName && email && phone) {
            setValues(prev => ({
                ...prev,
                name: `${firstName} ${lastName}`,
                email,
                phone,
            }));
        }
    }, [firstName, lastName, email, phone]);

    useEffect(() => {
        if (form.deliveryMethod === "address") {
            setValues((prev) => ({
                ...prev,
                office: null,
            }));
        } else if (form.deliveryMethod === "office" && form.office?.address) {
            setValues((prev) => ({
                ...prev,
                address: form.office.address,
            }));
        }
    }, [form.deliveryMethod]);


    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Финализиране на поръчка</h1>
            <form onSubmit={submitHandler} className="space-y-6">
                <SavedAddressSelect
                    addresses={addresses}
                    selectedSavedAddress={selectedSavedAddress}
                    setSelectedSavedAddress={setSelectedSavedAddress}
                />

                <CustomerInfo
                    form={form}
                    changeHandler={changeHandler}
                    selectedCity={selectedCity}
                    handleSelectCity={handleSelectCity}
                    cities={cities}
                    isMobile={isMobile}
                />
                <DeliveryOptions
                    form={form}
                    setValues={setValues}
                    deliveryCompany={deliveryCompany}
                    setDeliveryCompany={setDeliveryCompany}
                    deliveryMethod={deliveryMethod}
                    setDeliveryMethod={setDeliveryMethod}
                    selectedCity={selectedCity}
                    handleSelectCity={handleSelectCity}
                    offices={offices}
                    loadingOffices={loadingOffices}
                    selectedOfficeId={selectedOfficeId}
                    setSelectedOfficeId={setSelectedOfficeId}
                    changeHandler={changeHandler}
                    deliveryPrices={deliveryPrices}
                />

                <textarea name="comment" placeholder="Коментар към поръчката" value={form.comment} onChange={changeHandler} className="w-full border p-2 rounded" rows={2} />

                <InvoiceSection
                    invoice={form.invoice}
                    setInvoiceValue={(fnOrObj) =>
                        setValues((prev) => ({
                            ...prev,
                            invoice: typeof fnOrObj === 'function' ? fnOrObj(prev.invoice) : fnOrObj
                        }))
                    }
                />


                <div className="border-t pt-4 text-right text-base font-semibold text-blue-600">
                    Продукти: {productTotal.toFixed(2)} лв.<br />
                    Доставка: {deliveryTotal.toFixed(2)} лв.<br />
                    <span className="text-xl text-green-700 animate-pulse">Общо: {total.toFixed(2)} лв.</span>
                </div>

                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                    Изпрати поръчка
                </button>
            </form>
        </div>
    );
}