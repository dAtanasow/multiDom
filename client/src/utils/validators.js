export const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidName = (name) =>
    /^[A-Za-zА-Яа-яЁёЇїІіЄєЪъЬьЉљЊњЋћЌќѝҐґ' -]+$/u.test(name);

export const validateNameField = (label, value) => {
    if (value.length < 2) return `${label} трябва да е поне 2 символа.`;
    if (!isValidName(value)) return `${label} съдържа непозволени символи.`;
    return null;
};

export const validateRequired = (label, value, min = 1) => {
    if (!value || value.trim().length < min) {
        return min === 1
            ? `${label} е задължително.`
            : `${label} трябва да е поне ${min} символа.`;
    }
    return null;
};

export const validateEmailField = (value) => {
    if (!isValidEmail(value)) return "Невалиден имейл адрес.";
    return null;
};

export const validateVatId = (vatId, isVatRegistered) => {
    if (!vatId.trim()) return "Моля, въведете Булстат.";
    if (!/^\d{9,13}$/.test(vatId)) return "Булстат трябва да съдържа между 9 и 13 цифри.";
    if (isVatRegistered && !vatId.startsWith("BG")) return "ДДС номерът трябва да започва с 'BG'.";
    return null;
};

export const validateInvoice = ({ companyName, companyType, vatId, mol, companyAddress, isVatRegistered }) => {
    const errors = {
        companyName: validateRequired("Име на фирмата", companyName, 2),
        companyType: companyType ? null : "Моля, изберете тип на дружеството.",
        vatId: validateVatId(vatId, isVatRegistered),
        mol: validateRequired("МОЛ", mol, 5),
        companyAddress: validateRequired("Адрес", companyAddress, 5),
    };

    return Object.values(errors).some(Boolean) ? errors : null;
};


export function getLoginValidators() {
    return {
        email: (v) => {
            if (!v) return "Имейлът е задължителен.";
            if (!isValidEmail(v)) return "Невалиден имейл адрес.";
            return null;
        },
        password: (v) => {
            if (!v) return "Паролата е задължителна.";
            return null;
        }
    };
}

export function getRegisterValidators() {
    return {
        firstName: (v) => validateNameField("Името", v),
        lastName: (v) => validateNameField("Фамилията", v),
        email: (v) => isValidEmail(v) ? null : "Невалиден имейл.",
        password: (v) => v.length < 5 ? "Паролата трябва да е поне 5 символа." : null,
        rePassword: (v, values) =>
            v !== values.password ? "Паролите не съвпадат." : null,
    };
}


export function getCheckoutValidators() {
    return {
        firstName: (v) => validateNameField("Името", v),
        lastName: (v) => validateNameField("Фамилията", v),
        email: validateEmailField,
        city: (v) => validateRequired("Населено място", v),
        address: (v) => validateRequired("Адрес", v, 5),
        deliveryCompany: (v) => validateRequired("Доставчик", v),
        deliveryMethod: (v) => validateRequired("Метод на доставка", v),
        office: (_, values) =>
            values.deliveryMethod === "office"
                ? validateRequired("Офис", values.office?.address)
                : null,
    };
}
