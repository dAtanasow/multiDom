import { useIsMobile } from "../../../hooks/useResponsive";
import InvoiceFields from "./InvoiceFields";

export default function InvoiceSection({ invoice, setInvoiceValue, errors, submitted }) {
    const isMobile = useIsMobile();

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="invoice"
                    checked={invoice.useInvoice}
                    onChange={() =>
                        setInvoiceValue((prev) => ({
                            ...prev,
                            useInvoice: !prev.useInvoice,
                        }))
                    }
                />
                <label htmlFor="invoice" className="text-sm">
                    Искам фактура
                </label>
            </div>

            {invoice.useInvoice && (
                <InvoiceFields
                    form={invoice}
                    isMobile={isMobile}
                    errors={errors?.invoice || {}}
                    submitted={submitted}
                    changeHandler={(e) => {
                        const { name, value, checked } = e.target;

                        if (name === "isVatRegistered") {
                            setInvoiceValue((prev) => {
                                const shouldAddBG = checked && prev.vatId && !prev.vatId.startsWith("BG");
                                const updatedVatId = shouldAddBG ? `BG${prev.vatId}` : prev.vatId.replace(/^BG/, "");

                                return {
                                    ...prev,
                                    isVatRegistered: checked,
                                    vatId: updatedVatId,
                                };
                            });
                        } else {
                            setInvoiceValue((prev) => ({
                                ...prev,
                                [name]: value,
                            }));
                        }
                    }}
                />

            )}
        </div>
    );
}
