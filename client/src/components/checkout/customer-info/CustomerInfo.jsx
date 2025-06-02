import CitySelect from "./CitySelect";
import CustomPhoneInput from "../../CustomPhoneInput";
import { useState } from "react";

export default function CustomerInfo({ form, changeHandler, selectedCity, handleSelectCity, isMobile, cities, setValues, errors, setError, validators }) {
    const [phoneError, setPhoneError] = useState(false);

    return (
        <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-4 relative z-30`}>

            <div>
                <input
                    name="firstName"
                    placeholder="Име"
                    value={form.firstName}
                    onChange={changeHandler}
                    className={`border p-2 rounded w-full ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>

            <div>
                <input
                    name="lastName"
                    placeholder="Фамилия"
                    value={form.lastName}
                    onChange={changeHandler}
                    className={`border p-2 rounded w-full ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>

            <div className="col-span-2">
                <input
                    name="email"
                    type="email"
                    placeholder="Имейл"
                    value={form.email}
                    onChange={changeHandler}
                    className={`border p-2 rounded w-full ${errors.email ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="col-span-2">
                <CustomPhoneInput
                    value={String(form.phone)}
                    onChange={(phone) => setValues(prev => ({ ...prev, phone }))}
                    error={phoneError}
                    setError={setPhoneError}
                />
            </div>

            <div className="col-span-2">
                <CitySelect
                    cities={cities}
                    selectedCity={selectedCity}
                    setSelectedCity={handleSelectCity}
                    error={errors.city}
                    onChange={changeHandler}
                    validators={validators}
                    setError={setError}
                />
            </div>
        </div>
    );
}
