import { useState, useEffect } from "react";
import profileApi from "../api/profile";

export function useUserAddresses() {
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({ city: "", address: "" });

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const result = await profileApi.getAddresses();
                setAddresses(result);
            } catch (err) {
                console.error("Грешка при зареждане на адресите:", err);
            }
        };

        fetchAddresses();
    }, []);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddAddress = async (addressToAdd) => {
        const isPersonal = addressToAdd.deliveryMethod === "address";

        const hasBasic =
            addressToAdd.label?.trim() &&
            addressToAdd.deliveryMethod &&
            addressToAdd.city?.trim();

        const hasPersonalDetails = addressToAdd.address?.trim();
        const hasOfficeDetails =
            addressToAdd.office?.name?.trim() &&
            addressToAdd.office?.address?.trim() &&
            addressToAdd.office?.courierName?.trim();

        if (
            !hasBasic ||
            (isPersonal && !hasPersonalDetails) ||
            (!isPersonal && !hasOfficeDetails)
        ) {
            console.error("❌ Невалидни данни за адрес.");
            return;
        }

        try {
            const payload = {
                ...addressToAdd,
                office: isPersonal ? undefined : addressToAdd.office,
                address: isPersonal ? addressToAdd.address : undefined,
            };

            const updated = await profileApi.addAddress(payload);
            setAddresses(updated);

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
        } catch (err) {
            console.error("Грешка при добавяне на адрес:", err);
        }
    };


    const handleDeleteAddress = async (index) => {
        try {
            const updated = await profileApi.deleteAddress(index)
            setAddresses(updated);
        } catch (err) {
            console.error("Грешка при изтриване на адрес:", err);
        }
    };

    return {
        addresses,
        newAddress,
        handleAddressChange,
        handleAddAddress,
        handleDeleteAddress,
    };
}
