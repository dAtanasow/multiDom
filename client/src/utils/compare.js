export function isSame(a, b) {
    const normalize = (val) =>
        typeof val === 'string' ? val.trim().toLowerCase() : val;

    if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) {
        return normalize(a) === normalize(b);
    }

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) return false;

    for (const key of aKeys) {
        if (!bKeys.includes(key)) return false;
        if (!isSame(a[key], b[key])) return false;
    }

    return true;
}

export function isSameOffice(userOffice, candidate) {
    if (!userOffice || !candidate) return false;

    const normalizeText = (str) => (str || '').toLowerCase().trim();
    const normalizeAddress = (str) => normalizeText(str).replace(/[^a-zа-я0-9]/gi, '');

    const nameMatch = normalizeText(userOffice.name) === normalizeText(candidate.name);
    const courierMatch = normalizeText(userOffice.courierName) === normalizeText(candidate.courierName);
    const addressMatch = (() => {
        const user = normalizeAddress(userOffice.address);
        const candidateAddr = normalizeAddress(candidate.address);

        return (
            user === candidateAddr ||
            candidateAddr.includes(user) ||
            user.includes(candidateAddr)
        );
    })();

    const idMatch = userOffice._id && candidate._id
        ? String(userOffice._id) === String(candidate._id)
        : true;

    const result = nameMatch && courierMatch && addressMatch && idMatch;

    return result;
}
