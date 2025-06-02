const { body } = require('express-validator');

const registerValidator = [
    body('firstName')
        .trim()
        .isLength({ min: 2 }).withMessage('Името трябва да е поне 2 символа.')
        .matches(/^[A-Za-zА-Яа-яЁёЇїІіЄєЪъЬьЉљЊњЋћЌќѝҐґ' -]+$/u)
        .withMessage('Името може да съдържа само букви, тирета и апострофи.'),

    body('lastName')
        .trim()
        .isLength({ min: 2 }).withMessage('Фамилията трябва да е поне 2 символа.')
        .matches(/^[A-Za-zА-Яа-яЁёЇїІіЄєЪъЬьЉљЊњЋћЌќѝҐґ' -]+$/u)
        .withMessage('Фамилията може да съдържа само букви, тирета и апострофи.'),

    body('email')
        .isEmail().withMessage('Невалиден имейл адрес.')
        .normalizeEmail(),

    body('phone')
        .notEmpty().withMessage('Телефонът е задължителен.'),

    body('password')
        .isLength({ min: 5 }).withMessage('Паролата трябва да е поне 5 символа.'),

    body('rePassword')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Паролите не съвпадат.')
];

const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Моля, въведете валиден имейл.'),

  body('password')
    .notEmpty()
    .withMessage('Моля, въведете парола.')
];

module.exports = { registerValidator, loginValidator }