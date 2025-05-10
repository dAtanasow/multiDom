export default function InvoiceFields({ form, changeHandler, isMobile }) {
    return (
        <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
            <input name="companyName" placeholder="Фирма" value={form.companyName} onChange={changeHandler} className="border p-2 rounded" />
            <input name="bulstat" placeholder="ЕИК / Булстат" value={form.bulstat} onChange={changeHandler} className="border p-2 rounded" />
            <input name="vatNumber" placeholder="ДДС номер" value={form.vatNumber} onChange={changeHandler} className="border p-2 rounded" />
            <input name="mol" placeholder="МОЛ" value={form.mol} onChange={changeHandler} className="border p-2 rounded" />
        </div>
    );
}
