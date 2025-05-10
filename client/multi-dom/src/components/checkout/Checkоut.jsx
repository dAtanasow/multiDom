import { useNavigate } from "react-router-dom";
import { useCartContext } from "../../context/CartContext";
import { useIsMobile } from "../../hooks/useResponsive";
import { useForm } from "../../hooks/useForm";
import OfficeListbox from "./OfficeListbox";
import CitySelect from "./CitySelect";
import InvoiceFields from "./InvoiceFields";
import { cities } from "../mock-data/office-places";
import { useDelivery } from "../../hooks/useDelivery";
import { useTotals } from "../../hooks/useTotals";
import DeliveryMethod from "./DeliveryMethod";
import { deliveryPrices } from "../../constants/deliveryPrices";

export default function Checkout() {
    const { cart, clearCart } = useCartContext();
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const {
        values: form,
        changeHandler,
        submitHandler,
        setValues,
    } = useForm(
        {
            name: "",
            email: "",
            phone: "",
            city: "",
            region: "",
            zip: "",
            address: "",
            comment: "",
            office: null,
            companyName: "",
            bulstat: "",
            vatNumber: "",
            mol: "",
            useInvoice: false,
        },
        async (formData) => {
            console.log("Поръчка изпратена:", formData, cart);
            clearCart();
            navigate("/thank-you");
        }
    );

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

    const { productTotal, deliveryTotal, total } = useTotals(
        cart,
        deliveryCompany,
        deliveryMethod,
        deliveryPrices
    );

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Финализиране на поръчка</h1>
            <form onSubmit={submitHandler} className="space-y-6">

                <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
                    <input name="name" placeholder="Име и фамилия" value={form.name} onChange={changeHandler} required className="border p-2 rounded" />
                    <input name="email" type="email" placeholder="Имейл" value={form.email} onChange={changeHandler} required className="border p-2 rounded" />
                    <input name="phone" placeholder="Телефон" value={form.phone} onChange={changeHandler} required className="border p-2 rounded" />
                    <CitySelect
                        cities={cities}
                        selectedCity={selectedCity}
                        setSelectedCity={handleSelectCity}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Избери доставчик</label>
                    <div className="space-y-2">
                        {Object.entries(deliveryPrices).map(([company, price]) => (
                            <label key={company} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${deliveryCompany === company ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}>
                                <input
                                    type="radio"
                                    name="deliveryCompany"
                                    value={company}
                                    checked={deliveryCompany === company}
                                    onChange={(e) => setDeliveryCompany(e.target.value)}
                                    className="hidden"
                                />
                                <span className="text-sm font-medium">{company} <span className="text-gray-500">({price.toFixed(2)} лв.)</span></span>
                            </label>
                        ))}
                    </div>
                </div>

                {deliveryCompany && (
                    <DeliveryMethod
                        deliveryMethod={deliveryMethod}
                        setDeliveryMethod={setDeliveryMethod}
                    />
                )}

                {deliveryCompany && deliveryMethod === "office" && (
                    <div>
                        <label className="block text-sm font-medium mb-1">Избери офис</label>
                        {loadingOffices ? (
                            <p className="text-sm text-gray-500">Зареждане на офиси...</p>
                        ) : offices.length > 0 ? (
                            <OfficeListbox
                                offices={offices}
                                selectedOfficeId={selectedOfficeId}
                                setSelectedOfficeId={setSelectedOfficeId}
                            />
                        ) : (
                            <p className="text-sm text-red-600">Няма налични офиси за избрания град.</p>
                        )}
                    </div>
                )}

                {deliveryCompany && deliveryMethod === "address" && (
                    <div>
                        <label className="block text-sm font-medium mb-1">Адрес за доставка</label>
                        <textarea name="address" value={form.address} onChange={changeHandler} required className="w-full border p-2 rounded" rows={3} />
                    </div>
                )}

                <textarea name="comment" placeholder="Коментар към поръчката" value={form.comment} onChange={changeHandler} className="w-full border p-2 rounded" rows={2} />

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="invoice"
                        checked={form.useInvoice}
                        onChange={() =>
                            setValues((prev) => ({
                                ...prev,
                                useInvoice: !prev.useInvoice,
                            }))
                        }
                    />

                    <label htmlFor="invoice" className="text-sm">Искам фактура</label>
                </div>

                {form.useInvoice && (
                    <InvoiceFields form={form} changeHandler={changeHandler} isMobile={isMobile} />
                )}

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
