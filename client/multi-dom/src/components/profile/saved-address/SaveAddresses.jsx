import { useEffect, useState } from "react";
import { useDelivery } from "../../../hooks/useDelivery";
import AddressForm from "./AddressForm";
import SavedAddressList from "./SavedAddressList";

export default function SavedAddresses({ addresses = [], onAdd, onDelete }) {
    const [newAddress, setNewAddress] = useState({
        label: "",
        deliveryMethod: "address",
        city: "",
        address: "",
        office: {
            name: "",
            address: "",
            courierName: ""
        },
    });
    const [error, setError] = useState("");

    const {
        deliveryCompany,
        setDeliveryCompany,
        setDeliveryMethod,
        offices,
        loadingOffices,
        selectedOfficeId,
        setSelectedOfficeId,
        selectedCity,
        handleSelectCity
    } = useDelivery({
        ...newAddress,
        deliveryMethod: newAddress.deliveryMethod,
        city: newAddress.city
    }, setNewAddress);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("office.")) {
            const key = name.split(".")[1];
            setNewAddress(prev => ({
                ...prev,
                office: {
                    ...prev.office,
                    [key]: value
                }
            }));
        } else if (name === "deliveryCompany") {
            setDeliveryCompany(value);
        } else if (name === "deliveryMethod") {
            setDeliveryMethod(value);
            setNewAddress(prev => ({
                ...prev,
                deliveryMethod: value
            }));
        } else {
            setNewAddress(prev => ({ ...prev, [name]: value }));
        }
    };

    useEffect(() => {
        if (!selectedOfficeId) return;

        const selectedOffice = offices.find(o => String(o._id) === String(selectedOfficeId));
        if (selectedOffice) {
            setNewAddress(prev => ({
                ...prev,
                office: {
                    name: selectedOffice.name,
                    address: selectedOffice.address,
                    courierName: deliveryCompany
                }
            }));
        }
    }, [selectedOfficeId, offices, deliveryCompany]);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newAddress.label || !newAddress.deliveryMethod || !newAddress.city ||
            (newAddress.deliveryMethod === "address" && !newAddress.address) ||
            (newAddress.deliveryMethod === "office" &&
                (!newAddress.office.name || !newAddress.office.address || !newAddress.office.courierName))) {
            setError("Моля, попълнете всички задължителни полета.");
            return;
        }

        onAdd({
            ...newAddress,
            office: newAddress.deliveryMethod === "office"
                ? {
                    name: newAddress.office.name,
                    address: newAddress.office.address,
                    courierName: deliveryCompany
                }
                : undefined,
            address: newAddress.deliveryMethod === "address"
                ? newAddress.address
                : undefined
        });


        setNewAddress({
            label: "",
            deliveryMethod: "address",
            city: "",
            address: "",
            office: {
                name: "",
                address: "",
                courierName: ""
            }
        });
        setError("");
    };


    useEffect(() => {
        setDeliveryMethod(newAddress.deliveryMethod);
    }, [newAddress.deliveryMethod]);

    return (
        <div className="bg-gray-50 flex flex-col lg:flex-row gap-5">
            <div className="rounded-2xl p-6 w-full lg:w-1/2">
                <h3 className="text-xl font-bold text-gray-800 mb-4">📍 Запазени адреси</h3>
                <SavedAddressList addresses={addresses} onDelete={onDelete} />
            </div>
            <div className="bg-white rounded-2xl m-auto p-6 w-full h-full lg:w-1/2">
                <h4 className="text-xlfont-bold text-gray-800 mb-4">➕ Добави нов адрес</h4>
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
                        setNewAddress(prev => ({ ...prev, city }));
                    }}
                    onOfficeSelect={setSelectedOfficeId}
                    onCompanyChange={handleChange}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>

    );
}