const { body } = require("express-validator");

const checkoutValidator = [
    body("firstName")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Името трябва да е поне 2 символа.")
        .matches(/^[A-Za-zА-Яа-яЁёЇїІіЄєЪъЬьЉљЊњЋћЌќѝҐґ' -]+$/u)
        .withMessage("Името съдържа непозволени символи."),

    body("lastName")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Фамилията трябва да е поне 2 символа.")
        .matches(/^[A-Za-zА-Яа-яЁёЇїІіЄєЪъЬьЉљЊњЋћЌќѝҐґ' -]+$/u)
        .withMessage("Фамилията съдържа непозволени символи."),

    body("email")
        .isEmail()
        .withMessage("Невалиден имейл адрес."),

    body("phone")
        .notEmpty()
        .withMessage("Телефонът е задължителен."),

    body("city")
        .notEmpty()
        .withMessage("Населеното място е задължително."),

    body("deliveryCompany")
        .notEmpty()
        .withMessage("Доставчикът е задължителен."),

    body("deliveryMethod")
        .notEmpty()
        .withMessage("Методът на доставка е задължителен."),

    body("address").custom((value, { req }) => {
        if (req.body.deliveryMethod === "address") {
            if (!value || value.trim().length < 5) {
                throw new Error("Адресът трябва да е поне 5 символа.");
            }
        }
        return true;
    }),

    body("office.address").custom((value, { req }) => {
        if (req.body.deliveryMethod === "office") {
            if (!value || value.trim() === "") {
                throw new Error("Офисът е задължителен.");
            }
        }
        return true;
    }),

    body("items")
        .isArray({ min: 1 })
        .withMessage("Трябва да има поне един продукт в поръчката."),

    body("invoice.useInvoice").toBoolean(),

    body("invoice.companyName").if(body("invoice.useInvoice").equals(true)).notEmpty().withMessage("Името на фирмата е задължително."),
    body("invoice.companyType").if(body("invoice.useInvoice").equals(true)).notEmpty().withMessage("Типът на дружеството е задължителен."),
    body("invoice.vatId").if(body("invoice.useInvoice").equals(true)).notEmpty().withMessage("Булстат е задължителен."),
    body("invoice.mol").if(body("invoice.useInvoice").equals(true)).notEmpty().withMessage("МОЛ е задължителен."),
    body("invoice.companyAddress").if(body("invoice.useInvoice").equals(true)).notEmpty().withMessage("Адресът на фирмата е задължителен."),
];

module.exports = { checkoutValidator };
