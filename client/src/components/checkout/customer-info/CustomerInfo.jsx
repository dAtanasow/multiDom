import CitySelect from "./CitySelect";
import CustomPhoneInput from "../../CustomPhoneInput";
import { useState } from "react";

export default function CustomerInfo({ form, changeHandler, selectedCity, handleSelectCity, isMobile, cities, setValues }) {
    const [phoneError, setPhoneError] = useState(false);

    return (
        <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
            <input
                name="name"
                placeholder="Име и фамилия"
                value={form.name}
                onChange={changeHandler}
                required
                className="border p-2 rounded"
            />
            <input
                name="email"
                type="email"
                placeholder="Имейл"
                value={form.email}
                onChange={changeHandler}
                required
                className="border p-2 rounded"
            />
            <CustomPhoneInput
                value={String(form.phone)}
                onChange={(phone) => setValues(prev => ({ ...prev, phone }))}
                error={phoneError}
                setError={setPhoneError}
            />
            <CitySelect
                cities={cities}
                selectedCity={selectedCity}
                setSelectedCity={handleSelectCity}
            />
        </div>
    );
}
