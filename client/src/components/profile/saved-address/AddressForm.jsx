import CitySelect from "../../checkout/customer-info/CitySelect";
import OfficeListbox from "../../checkout/delivery-options/OfficeListbox";
import { cities } from "../../mock-data/office-places";

export default function AddressForm({
    newAddress,
    deliveryCompany,
    selectedOfficeId,
    selectedCity,
    offices,
    loadingOffices,
    error,
    onChange,
    onCitySelect,
    onOfficeSelect,
    onCompanyChange,
    onSubmit
}) {
    return (
        <form onSubmit={onSubmit}
            className="bg-white space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    name="label"
                    type="text"
                    placeholder="Етикет ('дом', 'офис')"
                    value={newAddress.label}
                    onChange={onChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <select
                    name="deliveryCompany"
                    value={deliveryCompany}
                    onChange={onCompanyChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"

                >
                    <option value="">Избери куриер</option>
                    <option value="Еконт">Еконт</option>
                    <option value="Спиди">Спиди</option>
                </select>

                <select
                    name="deliveryMethod"
                    value={newAddress.deliveryMethod}
                    onChange={onChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"

                >
                    <option value="address">Личен адрес</option>
                    <option value="office">Офис</option>
                </select>

                {newAddress.deliveryMethod === "office" && (
                    <>
                        <CitySelect
                            cities={cities}
                            selectedCity={selectedCity}
                            setSelectedCity={onCitySelect}
                        />
                        <div className="md:col-span-2">
                            {loadingOffices ? (
                                <p className="text-sm text-gray-500">Зареждане на офиси...</p>
                            ) : (
                                <OfficeListbox
                                    offices={offices}
                                    selectedOfficeId={selectedOfficeId}
                                    setSelectedOfficeId={onOfficeSelect}
                                />
                            )}
                        </div>
                    </>
                )}
    

                {newAddress.deliveryMethod === "address" && (
                    <>
                        <CitySelect
                            cities={cities}
                            selectedCity={newAddress.city}
                            setSelectedCity={(city) =>
                                onCitySelect(city)
                            }
                        />
                        <textarea
                            name="address"
                            placeholder="Адрес"
                            value={newAddress.address}
                            onChange={onChange}
                            className="block w-full md:col-span-2 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={2}
                        />
                    </>
                )}
            </div>



            {error && <p className="text-sm text-red-500">{error}</p>}

            <button type="submit"
                className="w-full bg-blue-600 text-white mt-3 py-2 px-4 rounded-md hover:bg-blue-700">
                Запази адреса
            </button>
        </form>
    );
}
