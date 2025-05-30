import { useIsMobile } from "../../../hooks/useResponsive";
import InvoiceFields from "./InvoiceFields";


export default function InvoiceSection({ invoice, setInvoiceValue }) {
    const isMobile = useIsMobile()
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
                    changeHandler={(e) =>
                        setInvoiceValue((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value,
                        }))
                    }
                />
            )}
        </div>
    );
}
