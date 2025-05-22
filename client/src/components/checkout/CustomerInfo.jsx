import CitySelect from "./CitySelect";

export default function CustomerInfo({ form, changeHandler, selectedCity, handleSelectCity, isMobile, cities }) {
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
            <input
                name="phone"
                placeholder="Телефон"
                value={form.phone ? "+" + form.phone : ""}
                onChange={changeHandler}
                required
                className="border p-2 rounded"
            />
            <CitySelect
                cities={cities}
                selectedCity={selectedCity}
                setSelectedCity={handleSelectCity}
            />
        </div>
    );
}
