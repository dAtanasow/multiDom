import { useEffect, useRef, useState } from "react";
import econtApi from "../api/econt";
import speedyApi from "../api/speedy";
import { normalizeOffices, normalizeCity } from "../utils/location";

export function useDelivery(form, setValues) {
    const [deliveryCompany, setDeliveryCompany] = useState("");
    const [deliveryMethod, setDeliveryMethod] = useState("");
    const [selectedOfficeId, setSelectedOfficeId] = useState(null);
    const [offices, setOffices] = useState([]);
    const [loadingOffices, setLoadingOffices] = useState(false);
    const [selectedCity, setSelectedCity] = useState("");

    const hasSyncedOffice = useRef(false);

    useEffect(() => {
        if (!hasSyncedOffice.current && selectedOfficeId) {
            setValues((prev) => ({ ...prev, office: selectedOfficeId }));
            hasSyncedOffice.current = true;
        }
    }, [selectedOfficeId]);

    useEffect(() => {
        hasSyncedOffice.current = false;
    }, [deliveryCompany, deliveryMethod, form.city]);

    useEffect(() => {
        const fetchOffices = async () => {
            if (!selectedCity || deliveryMethod !== "office") return;
            setLoadingOffices(true);
            try {
                let raw = [];
                let matched = null;
                const cityNormalized = normalizeCity(selectedCity);

                if (deliveryCompany === "Еконт") {
                    const result = await econtApi.getByCity(selectedCity);
                    matched = Array.isArray(result)
                        ? result.find((r) => normalizeCity(r.city) === cityNormalized)
                        : null;
                    raw = matched?.offices?.map((o) => o.toObject ? o.toObject() : o) || [];

                } else if (deliveryCompany === "Спиди") {
                    const result = await speedyApi.getByCity(selectedCity);
                    matched = Array.isArray(result)
                        ? result.find((r) => normalizeCity(r.city) === cityNormalized)
                        : null;
                    raw = matched?.offices?.map((o) => o.toObject ? o.toObject() : o) || [];
                }

                const plainOffices = Array.from(raw || []).map((o) => o.toObject?.() || o._doc || o);
                const cityFull = matched?.city || "";
                const response = normalizeOffices(plainOffices, deliveryCompany, cityFull);
                setOffices(response);
            } catch (err) {
                console.error("Грешка при зареждане на офиси:", err);
                setOffices([]);
            } finally {
                setLoadingOffices(false);
            }
        };
        fetchOffices();
    }, [selectedCity, deliveryCompany, deliveryMethod]);

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
