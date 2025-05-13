export const normalizeOffices = (arr, provider, cityFull = "") => {
    const cityOnly = cityFull.split("(")[0].trim().toUpperCase();
    const postalCodeMatch = cityFull.match(/\[(\d{4})\]/);
    const postalCode = postalCodeMatch ? postalCodeMatch[1] : "";

    return arr.map((office, i) => {
        const rawName = office.name || "Без име";
        let address = office.address || "Без адрес";
        const _id = office._id?.toString?.() || `${provider}-${i}`;

        let name = rawName.trim();
        const cityPrefixRegex = new RegExp(`^${cityOnly.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[-–—]\\s*`, 'i');
        name = name.replace(cityPrefixRegex, "").trim();

        const addressRegex = new RegExp(`^гр\\.\\s*${cityOnly}(\\s*\\[\\d{4}\\])?\\s*`, 'i');
        address = address.replace(addressRegex, "").trim();
        if (address && cityOnly) {
            address = `${address}, гр. ${cityOnly.charAt(0) + cityOnly.slice(1).toLowerCase()} ${postalCode}`;
        }

        return { _id, name, address };
    });
};

export const normalizeCity = (str) => {
    const cleaned = String(str || "")
        .replace(/^гр\.?\s*/i, "")
        .replace(/[\(\[].*?[\)\]]/g, "")
        .replace(/[^\p{L}\d\s]/gu, "")
        .replace(/\s+/g, " ")
        .toLowerCase()
        .trim();
    return cleaned;
};

