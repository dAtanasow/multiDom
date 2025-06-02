export default function InvoiceFields({ form, changeHandler, isMobile, errors, submitted }) {
    const inputClass = (field) =>
        `border p-2 rounded w-full ${errors?.[field] ? "border-red-500" : "border-gray-300"}`;

    return (
        <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
            <div>
                <input
                    name="companyName"
                    placeholder="Фирма"
                    value={form.companyName}
                    onChange={changeHandler}
                    className={inputClass("companyName")}
                />
                {submitted && errors?.companyName && (
                    <p className="text-red-500 text-sm">{errors.companyName}</p>
                )}
            </div>

            <div>
                <select
                    name="companyType"
                    value={form.companyType}
                    onChange={changeHandler}
                    className={inputClass("companyType")}
                >
                    <option value="">Тип на дружеството</option>
                    <option value="ET">ЕТ</option>
                    <option value="EOOD">ЕООД</option>
                    <option value="OOD">ООД</option>
                    <option value="AD">АД</option>
                    <option value="EAD">ЕАД</option>
                    <option value="SD">СД</option>
                    <option value="KD">КД</option>
                    <option value="KDA">КДА</option>
                    <option value="DZZD">ДЗЗД</option>
                    <option value="KOO">КООП</option>
                    <option value="NPO">НПО</option>
                </select>
                {errors?.companyType && <p className="text-red-500 text-sm">{errors.companyType}</p>}
            </div>

            <div>
                <input
                    name="mol"
                    placeholder="МОЛ"
                    value={form.mol}
                    onChange={changeHandler}
                    className={inputClass("mol")}
                />
                {errors?.mol && <p className="text-red-500 text-sm">{errors.mol}</p>}
            </div>

            <div>
                <input
                    name="vatId"
                    placeholder="ЕИК / Булстат"
                    value={form.vatId}
                    onChange={changeHandler}
                    className={inputClass("vatId")}
                />
                {errors?.vatId && <p className="text-red-500 text-sm">{errors.vatId}</p>}
            </div>

            <div className="col-span-2 flex items-center gap-2">
                <input
                    type="checkbox"
                    name="isVatRegistered"
                    id="isVatRegistered"
                    checked={form.isVatRegistered}
                    onChange={changeHandler}
                />
                <label htmlFor="isVatRegistered" className="text-sm">
                    Регистрация по ДДС
                </label>
            </div>

            <div className="col-span-2">
                <textarea
                    name="companyAddress"
                    placeholder="Адрес"
                    value={form.companyAddress}
                    onChange={changeHandler}
                    className={inputClass("companyAddress")}
                />
                {errors?.companyAddress && <p className="text-red-500 text-sm">{errors.companyAddress}</p>}
            </div>
        </div>
    );
}
