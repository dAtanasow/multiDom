import { useState } from "react";
import CustomPhoneInput from "../../CustomPhoneInput";

export function ProfileFields({ values, changeHandler, editMode }) {
    const [phoneError, setPhoneError] = useState(false);
    return (
        <div className="flex flex-col gap-4 max-w-sm mx-auto">
            <Field label="Име" value={values.firstName} name="firstName" editMode={editMode} changeHandler={changeHandler} />
            <Field label="Фамилия" value={values.lastName} name="lastName" editMode={editMode} changeHandler={changeHandler} />
            <Field label="Имейл" value={values.email} name="email" editMode={editMode} changeHandler={changeHandler} />
            <CustomPhoneInput
                value={String(values.phone)}
                onChange={(phone) => {
                    if (typeof phone === 'string') {
                        changeHandler({ target: { name: 'phone', value: phone } });
                    } else {
                        console.warn("Получен невалиден номер:", phone);
                    }
                }}
                error={phoneError}
                setError={setPhoneError}
                disabled={!editMode}
            />
        </div>
    );
}

function Field({ label, value, name, editMode, changeHandler }) {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={name} className="text-sm text-gray-400">
                {label}
            </label>
            {editMode ? (
                <input
                    id={name}
                    name={name}
                    value={value}
                    onChange={changeHandler}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
            ) : (
                <p className="text-base text-gray-800 font-medium">{value}</p>
            )}
        </div>

    );
}
