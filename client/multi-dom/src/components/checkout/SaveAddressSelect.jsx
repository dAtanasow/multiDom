export default function SavedAddressSelect({ addresses, selectedSavedAddress, setSelectedSavedAddress }) {
    if (!addresses.length) return null;

    return (
        <div>
            <label className="block text-sm font-medium mb-1">Избери запазен адрес</label>
            <select
                value={selectedSavedAddress}
                onChange={(e) => setSelectedSavedAddress(e.target.value)}
                className="w-full border p-2 rounded"
            >
                <option value="">-- Без избор --</option>
                {addresses.map(addr => (
                    <option key={addr._id} value={addr._id}>
                        {addr.label} ({addr.deliveryMethod === "office" ? "офис" : "личен"})
                    </option>
                ))}
            </select>
        </div>
    );
}
