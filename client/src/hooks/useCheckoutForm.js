import { useNavigate } from "react-router";
import { useForm } from "./useForm";
import { deliveryPrices } from "../constants/deliveryPrices";
import orderApi from "../api/order";
import { useMemo } from "react";
import { toast } from "react-toastify";
import { validateEmailField, validateInvoice, validateNameField, validateRequired } from "../utils/validators";
import { normalizeCartItems } from "../utils/normalize";
import { getCheckoutValidators } from "../utils/getCheckoutValidators";

export function useCheckoutForm(cart, clearCart) {
    const navigate = useNavigate();
    const validators = getCheckoutValidators();

    const initialValues = useMemo(() => ({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        city: "",
        comment: "",
        office: null,
        deliveryMethod: "",
        deliveryCompany: "",
        invoice: {
            useInvoice: false,
            companyName: "",
            companyType: "",
            vatId: "",
            isVatRegistered: false,
            mol: "",
            companyAddress: ""
        },
        address: "",
    }), []);

    return useForm(initialValues, async (form) => {
        const errors = {};

        errors.firstName = validateNameField("Името", form.firstName);
        errors.lastName = validateNameField("Фамилията", form.lastName);
        errors.email = validateEmailField(form.email);
        errors.city = validateRequired("Населено място", form.city);


        if (form.deliveryMethod === "office" && !form.office) {
            errors.office = "Моля, изберете офис за доставка.";
        }

        if (form.deliveryMethod === "address" && (!form.address || form.address.trim().length < 5)) {
            errors.address = "Моля, въведете валиден адрес за доставка (поне 5 символа).";
        }

        if (form.city) {
            if (!form.deliveryCompany) {
                errors.deliveryCompany = "Моля, изберете доставчик.";
            }
            if (!form.deliveryMethod) {
                errors.deliveryMethod = "Моля, изберете метод за доставка.";
            }
        }

        if (form.invoice?.useInvoice) {
            const invoiceErrors = validateInvoice(form.invoice);
            if (invoiceErrors) errors.invoice = invoiceErrors;
        }

        const { deliveryCompany, deliveryMethod } = form;
        const methodPrice = deliveryPrices[deliveryCompany]?.[deliveryMethod];
        const deliveryTotal = typeof methodPrice === 'number' ? methodPrice : 0;

        if (Object.keys(errors).length > 0) {
            toast.error("Моля, коригирайте грешките във формата.");
            throw {
                validationErrors: {
                    ...errors,
                    invoice: errors.invoice || {},
                }
            };
        }

        const payload = {
            ...form,
            deliveryTotal,
            address: deliveryMethod === "office"
                ? form.office?.address
                : form.address,
            invoice: {
                ...form.invoice,
            },
            items: normalizeCartItems(cart),
        };

        try {
            await orderApi.createOrder(payload);
            clearCart();
            navigate("/thank-you");
        } catch (err) {
            console.error("❌ Грешка при изпращане на поръчка:", err);
            throw err;
        }
    }, validators);
}