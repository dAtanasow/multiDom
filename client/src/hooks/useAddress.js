import { useState, useEffect, useCallback, useRef } from 'react';
import profileApi from '../api/profile';
import { extractOfficeFromAddress, extractNewFormValues, fetchCourierOffices } from '../utils/delivery';
import { deliveryPrices } from '../constants/deliveryPrices';
import { isSame, isSameOffice, } from '../utils/compare'

export function useUserAddresses() {
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({ city: '', address: '' });

    const fetchAddresses = async () => {
        try {
            const result = await profileApi.getAddresses();
            setAddresses(result);
        } catch (err) {
            console.error('Грешка при зареждане на адресите:', err);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddAddress = async (addressToAdd) => {
        const isPersonal = addressToAdd.deliveryMethod === 'address';

        const hasBasic =
            addressToAdd.label?.trim() &&
            addressToAdd.deliveryMethod &&
            addressToAdd.city?.trim();

        const hasPersonalDetails = addressToAdd.address?.trim();
        const hasOfficeDetails =
            addressToAdd.office?.name?.trim() &&
            addressToAdd.office?.address?.trim() &&
            addressToAdd.office?.courierName?.trim();

        if (!hasBasic || (isPersonal && !hasPersonalDetails) || (!isPersonal && !hasOfficeDetails)) {
            console.error('❌ Невалидни данни за адрес.');
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
                label: '',
                deliveryMethod: 'address',
                city: '',
                address: '',
                office: {
                    name: '',
                    address: '',
                    courierName: '',
                },
            });
        } catch (err) {
            console.error('Грешка при добавяне на адрес:', err);
        }
    };

    const handleDeleteAddress = async (index) => {
        try {
            const updated = await profileApi.deleteAddress(index);
            setAddresses(updated);
        } catch (err) {
            console.error('Грешка при изтриване на адрес:', err);
        }
    };

    return {
        addresses,
        newAddress,
        handleAddressChange,
        handleAddAddress,
        handleDeleteAddress,
        refreshAddresses: fetchAddresses,
    };
}

export function useApplyAddressToForm({
    selectedSavedAddress,
    addresses,
    form,
    setValues,
    setSelectedOfficeId,
    selectedOfficeId,
    handleSelectCity,
    offices,
    loadingOffices,
}) {
    const prevAppliedRef = useRef(null);
    const pendingOfficeRef = useRef(null);

    useEffect(() => {
        const addressObj = addresses.find((a) => a._id === selectedSavedAddress);
        if (!addressObj) return;

        const newValues = extractNewFormValues(addressObj);

        if (!isSame(prevAppliedRef.current, newValues)) {
            prevAppliedRef.current = newValues;
            if (form.city !== addressObj.city) {
                handleSelectCity(addressObj.city);
            }
            setValues(newValues);
        }
    }, [selectedSavedAddress, addresses, form.city, setValues, handleSelectCity]);

    useEffect(() => {
        if (form.deliveryMethod !== 'office' && selectedOfficeId !== null) {
            setSelectedOfficeId(null);
        }
    }, [form.deliveryMethod, selectedOfficeId, setSelectedOfficeId]);


    useEffect(() => {
        const address = addresses.find((a) => a._id === selectedSavedAddress);
        if (!address || address.deliveryMethod !== 'office') return;

        const userOffice = extractOfficeFromAddress(address);
        pendingOfficeRef.current = userOffice;
    }, [selectedSavedAddress, addresses]);

    useEffect(() => {
        if (!pendingOfficeRef.current || loadingOffices || !offices?.length) return;

        const match = offices.find((o) => isSameOffice(pendingOfficeRef.current, o));

        if (match && match._id !== selectedOfficeId) {
            setSelectedOfficeId(match._id);
        }

        pendingOfficeRef.current = null;
    }, [offices, loadingOffices, selectedOfficeId, setSelectedOfficeId]);

}

export function useDelivery(form, setValues) {
    const [offices, setOffices] = useState([]);
    const [loadingOffices, setLoadingOffices] = useState(false);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedOfficeId, _setSelectedOfficeId] = useState(null);
    const setSelectedOfficeId = useCallback((val) => _setSelectedOfficeId(val), []);
    const prevOfficeRef = useRef(null);

    const deliveryCompany = form.deliveryCompany;
    const setDeliveryCompany = (val) => setValues(prev => ({ ...prev, deliveryCompany: val }));
    const deliveryMethod = form.deliveryMethod;
    const setDeliveryMethod = (val) => setValues(prev => ({ ...prev, deliveryMethod: val }));

    useEffect(() => {
        const rawPrice = deliveryPrices?.[deliveryCompany]?.[deliveryMethod];
        const price = typeof rawPrice === 'number' ? rawPrice : parseFloat(rawPrice);
        const isValidPrice = !isNaN(price) && isFinite(price);

        setValues((prev) => ({
            ...prev,
            deliveryTotal: isValidPrice ? price : 0,
        }));
    }, [deliveryCompany, deliveryMethod, setValues]);


    useEffect(() => {
        if (!selectedOfficeId || !offices.length) return;

        const selectedOffice = offices.find((o) => o._id === selectedOfficeId);
        if (!selectedOffice) return;

        const newOffice = {
            name: selectedOffice.name,
            address: selectedOffice.address,
            city: selectedOffice.city || form.city,
            courierName: selectedOffice.courierName || deliveryCompany,
        };

        if (!isSameOffice(form.office, newOffice)) {
            prevOfficeRef.current = newOffice;
            setValues(prev => ({ ...prev, office: newOffice }));
        }
    }, [selectedOfficeId, offices, form.office, form.city, deliveryCompany, setValues]);

    useEffect(() => {
        setSelectedOfficeId(null);
    }, [deliveryCompany, deliveryMethod, selectedCity, setSelectedOfficeId]);

    useEffect(() => {
        if (!form.office || !form.office.name || !form.office.address || !offices.length) return;

        const match = offices.find((o) => isSameOffice(form.office, o));
        if (!match) return;

        if (match && match._id !== selectedOfficeId && !isSameOffice(form.office, match)) {
            setSelectedOfficeId(match._id);
        }
    }, [form.office, offices, selectedOfficeId, setSelectedOfficeId]);

    useEffect(() => {
        const fetchOffices = async () => {
            const city = form.city?.trim().toLowerCase();
            const courier = deliveryCompany?.trim().toLowerCase();

            if (!city || deliveryMethod !== 'office' || !courier) return;

            setLoadingOffices(true);
            try {
                const officesData = await fetchCourierOffices(city, courier);
                setOffices(officesData);
            } catch (err) {
                console.error('❌ Грешка при зареждане на офиси:', err);
                setOffices([]);
            } finally {
                setLoadingOffices(false);
            }
        };

        fetchOffices();
    }, [form.city, deliveryCompany, deliveryMethod]);

    const handleSelectCity = (city) => {
        setSelectedCity(city);
        setValues(prev => ({ ...prev, city }));
    };

    return {
        deliveryCompany,
        setDeliveryCompany,
        deliveryMethod,
        setDeliveryMethod,
        selectedCity,
        setSelectedCity,
        handleSelectCity,
        selectedOfficeId,
        setSelectedOfficeId,
        offices,
        loadingOffices,
    };
}