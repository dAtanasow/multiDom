import CitySelect from "../../checkout/CitySelect";
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
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    name="label"
                    type="text"
                    placeholder="Етикет (напр. 'дом', 'офис')"
                    value={newAddress.label}
                    onChange={onChange}
                    className="input-style p-2"
                />
                <select
                    name="deliveryMethod"
                    value={newAddress.deliveryMethod}
                    onChange={onChange}
                    className="input-style p-2"
                >
                    <option value="address">Личен адрес</option>
                    <option value="office">Офис</option>
                </select>

                <select
                    name="deliveryCompany"
                    value={deliveryCompany}
                    onChange={onCompanyChange}
                    className="input-style p-2"
                >
                    <option value="">Избери куриер</option>
                    <option value="Еконт">Еконт</option>
                    <option value="Спиди">Спиди</option>
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
                            className="input-style p-2 md:col-span-2"
                            rows={2}
                        />
                    </>
                )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button type="submit" className="btn-primary w-full">
                💾 Запази адреса
            </button>
        </form>
    );
}
