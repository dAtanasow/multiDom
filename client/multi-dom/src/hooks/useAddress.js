import { useState, useEffect } from 'react';
import profileApi from '../api/profile';
import { normalizeAddress, normalizeOffices } from '../utils/location';
import econtApi from '../api/econt';
import speedyApi from '../api/speedy';

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

        if (
            !hasBasic ||
            (isPersonal && !hasPersonalDetails) ||
            (!isPersonal && !hasOfficeDetails)
        ) {
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
    useEffect(() => {
        if (!selectedSavedAddress) return;

        const address = addresses.find((a) => a._id === selectedSavedAddress);
        if (!address) return;

        const isOffice = address.deliveryMethod === 'office';

        setValues((prev) => ({
            ...prev,
            city: address.city,
            deliveryMethod: address.deliveryMethod,
            deliveryCompany: isOffice
                ? address.office?.courierName || ''
                : address.deliveryCompany || '',
            address: isOffice ? '' : address.address || '',
            office: isOffice ? address.office : null,
        }));

        handleSelectCity(address.city);
    }, [selectedSavedAddress, addresses]);


    useEffect(() => {
        if (form.deliveryMethod !== 'office' && selectedOfficeId !== null) {
            setSelectedOfficeId(null);
        }
    }, [form.deliveryMethod]);
    useEffect(() => {
        const address = addresses.find((a) => a._id === selectedSavedAddress);
        if (
            !address ||
            address.deliveryMethod !== 'office' ||
            loadingOffices ||
            !offices?.length
        ) return;

        const userOffice = {
            name: address.office?.name || '',
            address: address.office?.address || '',
            courierName: address.office?.courierName || '',
        };

        const match = offices.find((o) => isSameOffice(userOffice, o));

        if (match) {
            setSelectedOfficeId(match._id);
        }
    }, [offices, selectedSavedAddress, form.city, form.deliveryCompany, loadingOffices]);
}

function isSameOffice(userOffice, candidate) {
    const normalizeText = (str) => (str || '').toLowerCase().trim();

    if (!userOffice || !candidate) return false;

    const nameMatch = normalizeText(userOffice.name) === normalizeText(candidate.name);
    const courierMatch = normalizeText(userOffice.courierName) === normalizeText(candidate.courierName);

    const addressUser = normalizeText(userOffice.address || '').replace(/[^a-zа-я0-9]/gi, '');
    const addressCandidate = normalizeText(candidate.address || '').replace(/[^a-zа-я0-9]/gi, '');

    const addressMatch =
        addressUser.includes(addressCandidate) || addressCandidate.includes(addressUser);

    return nameMatch && courierMatch && addressMatch;
}

export function useDelivery(form, setValues) {
    const deliveryCompany = form.deliveryCompany;
    const setDeliveryCompany = (val) =>
        setValues((prev) => ({ ...prev, deliveryCompany: val }));

    const deliveryMethod = form.deliveryMethod;
    const setDeliveryMethod = (val) =>
        setValues((prev) => ({ ...prev, deliveryMethod: val }));

    const [selectedOfficeId, setSelectedOfficeId] = useState(null);
    const [offices, setOffices] = useState([]);
    const [loadingOffices, setLoadingOffices] = useState(false);
    const [selectedCity, setSelectedCity] = useState('');

    useEffect(() => {
        if (!selectedOfficeId || !offices.length) return;

        const selectedOffice = offices.find((o) => o._id === selectedOfficeId);
        if (!selectedOffice) return;

        setValues((prev) => ({
            ...prev,
            office: {
                name: selectedOffice.name,
                address: selectedOffice.address,
                city: selectedOffice.city || form.city,
                courierName: selectedOffice.courierName || deliveryCompany,
            },
        }));

    }, [selectedOfficeId, offices]);

    useEffect(() => {
        setSelectedOfficeId(null);
    }, [deliveryCompany, deliveryMethod, selectedCity]);

    useEffect(() => {
        if (!form.office || !form.office.name || !form.office.address) return;
        if (!offices.length) return;

        const match = offices.find((o) =>
            o.name === form.office.name &&
            o.address === form.office.address &&
            o.courierName === form.office.courierName
        );
        if (match) {
            setSelectedOfficeId(match._id);
        }
    }, [form.office, offices]);

    useEffect(() => {
        const fetchOffices = async () => {
            const city = form.city?.trim();
            if (!city || deliveryMethod !== 'office' || !deliveryCompany) return;

            const cityNormalized = normalizeAddress(city);
            setLoadingOffices(true);

            try {
                let raw = [];
                let matched = null;

                if (deliveryCompany === 'Еконт') {
                    const result = await econtApi.getByCity(city);
                    matched = Array.isArray(result)
                        ? result.find((r) => normalizeAddress(r.city) === cityNormalized)
                        : null;
                    raw = matched?.offices || [];
                } else if (deliveryCompany === 'Спиди') {
                    const result = await speedyApi.getByCity(city);
                    matched = Array.isArray(result)
                        ? result.find((r) => normalizeAddress(r.city).includes(cityNormalized))
                        : null;
                    raw = matched?.offices || [];
                }

                const plainOffices = raw.map((o) => o.toObject?.() || o._doc || o);
                const cityFull = matched?.city || '';
                const response = normalizeOffices(plainOffices, deliveryCompany, cityFull);

                setOffices(response);
            } catch (err) {
                console.error('Грешка при зареждане на офиси:', err);
                setOffices([]);
            } finally {
                setLoadingOffices(false);
            }
        };

        fetchOffices();
    }, [form.city, deliveryCompany, deliveryMethod]);

    const handleSelectCity = (city) => {
        setSelectedCity(city);
        setValues((prev) => ({ ...prev, city }));
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
