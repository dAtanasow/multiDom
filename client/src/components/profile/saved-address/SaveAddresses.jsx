import { useCallback, useEffect, useState } from "react";
import AddressForm from "./AddressForm";
import SavedAddressList from "./SavedAddressList";
// import { toast } from "react-toastify";
import { toast } from "sonner";
import { useUserAddresses, useDelivery } from "../../../hooks/useAddress";
import { isSame } from "../../../utils/compare";

export default function SavedAddresses() {
    const [error, setError] = useState("");
    const [newAddress, setNewAddress] = useState({
        label: "",
        deliveryMethod: "address",
        city: "",
        address: "",
        office: {
            name: "",
            address: "",
            courierName: "",
        },
    });

    const setNewAddressCallback = useCallback((updater) => {
        setNewAddress(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            return isSame(prev, next) ? prev : next;
        });
    }, []);


    const {
        addresses,
        handleAddAddress,
        handleDeleteAddress,
        refreshAddresses,
    } = useUserAddresses();

    const {
        deliveryCompany,
        setDeliveryCompany,
        setDeliveryMethod,
        offices,
        loadingOffices,
        selectedOfficeId,
        setSelectedOfficeId,
        selectedCity,
        handleSelectCity,
    } = useDelivery(
        {
            ...newAddress,
            deliveryMethod: newAddress.deliveryMethod,
            city: newAddress.city,
        },
        setNewAddressCallback
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("office.")) {
            const key = name.split(".")[1];
            setNewAddress((prev) => ({
                ...prev,
                office: {
                    ...prev.office,
                    [key]: value,
                },
            }));
        } else if (name === "deliveryCompany") {
            setDeliveryCompany(value);
        } else if (name === "deliveryMethod") {
            setDeliveryMethod(value);
            setNewAddress((prev) => ({
                ...prev,
                deliveryMethod: value,
            }));
        } else {
            setNewAddress((prev) => ({ ...prev, [name]: value }));
        }
    };

    useEffect(() => {
        if (!selectedOfficeId) return;
        const selectedOffice = offices.find(
            (o) => String(o._id) === String(selectedOfficeId)
        );
        if (selectedOffice) {
            setNewAddress((prev) => ({
                ...prev,
                office: {
                    name: selectedOffice.name,
                    address: selectedOffice.address,
                    courierName: deliveryCompany,
                },
            }));
        }
    }, [selectedOfficeId, offices, deliveryCompany]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid =
            newAddress.label &&
            newAddress.deliveryMethod &&
            newAddress.city &&
            (newAddress.deliveryMethod === "address"
                ? newAddress.address
                : newAddress.office.name &&
                newAddress.office.address &&
                newAddress.office.courierName);

        if (!isValid) {
            setError("Моля, попълнете всички задължителни полета.");
            return;
        }

        const payload = {
            ...newAddress,
            office:
                newAddress.deliveryMethod === "office"
                    ? {
                        name: newAddress.office.name,
                        address: newAddress.office.address,
                        courierName: deliveryCompany,
                    }
                    : undefined,
            address:
                newAddress.deliveryMethod === "address"
                    ? newAddress.address
                    : undefined,
        };

        try {
            await handleAddAddress(payload);
            toast.success("Адресът беше добавен успешно!");
            setNewAddress({
                label: "",
                deliveryMethod: "address",
                city: "",
                address: "",
                office: {
                    name: "",
                    address: "",
                    courierName: "",
                },
            });
            setError("");
            await refreshAddresses();
        } catch (err) {
            toast.error("Възникна грешка при добавяне на адрес.", err.message);
        }
    };

    useEffect(() => {
        setDeliveryMethod(newAddress.deliveryMethod);
    }, [newAddress.deliveryMethod, setDeliveryMethod]);

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="bg-white rounded-2xl shadow-md p-6 w-full lg:w-1/2 border border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
                    <span className="text-pink-600 text-xl">📍</span> Запазени адреси
                </h3>
                <SavedAddressList addresses={addresses} onDelete={handleDeleteAddress} />
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 w-full lg:w-1/2 border border-gray-200">
                <h4 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
                    <span className="text-purple-600 text-xl">➕</span> Добави нов адрес
                </h4>
                <AddressForm
                    newAddress={newAddress}
                    deliveryCompany={deliveryCompany}
                    selectedOfficeId={selectedOfficeId}
                    selectedCity={selectedCity}
                    offices={offices}
                    loadingOffices={loadingOffices}
                    error={error}
                    onChange={handleChange}
                    onCitySelect={(city) => {
                        handleSelectCity(city);
                        setNewAddress((prev) => ({ ...prev, city }));
                    }}
                    onOfficeSelect={setSelectedOfficeId}
                    onCompanyChange={handleChange}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
