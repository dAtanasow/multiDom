export const normalizeOffices = (arr, provider, cityFull = "") => {
    const cityOnly = cityFull.split("(")[0].trim().toUpperCase();
    const cityNameNormalized = cityOnly.charAt(0) + cityOnly.slice(1).toLowerCase();

    const cityPrefixRegex = new RegExp(`^${cityOnly}\\s*[-–—]\\s*`, "i");

    return arr.map((office, i) => {
        const rawName = office.name || "Без име";
        const rawAddress = office.address || "Без адрес";
        const _id = office._id?.toString?.() || `${provider}-${i}`;

        const cleanName = rawName.replace(cityPrefixRegex, "").trim();
        const cleanAddress = rawAddress.replace(/^гр\.?\s*[\p{L}\s]+(\[\d+\])?/iu, "").trim();

        return {
            _id,
            name: cleanName,
            address: cleanAddress,
            courierName: office.courierName || provider,
            city: cityNameNormalized
        };
    });
};

export function normalizeText(str = "") {
    return String(str || "")
        .normalize("NFKC")
        .toLowerCase()
        .replace(/\s*\(.*?\)\s*/g, "")
        .replace(/\b(гр\.?|град|no|№)\b/gi, "")
        .replace(/\[\d+\]/g, "")
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .replace(/\s+/g, " ")
        .trim();
}

export function normalizeAddress(address = "", city = "") {
    return normalizeText(`${address} ${city}`);
}

export const normalizeProduct = (product) => {
    if (!product || typeof product !== 'object') return product;

    const hasValidDiscount =
        typeof product.discountPrice === "number" &&
        product.discountPrice < product.price;

    return {
        ...product,
        discountPrice: hasValidDiscount ? product.discountPrice : null,
        quantity: product.quantity ?? 1
    };
};
