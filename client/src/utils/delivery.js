import econtApi from '../api/econt';
import speedyApi from '../api/speedy';
import { normalizeAddress, normalizeOffices } from './normalize';

export function extractOfficeFromAddress(address) {
    return {
        _id: address.office?._id || '',
        name: address.office?.name || '',
        address: address.office?.address || '',
        courierName: address.office?.courierName || '',
    };
}

export function extractNewFormValues(address) {
    const isOffice = address.deliveryMethod === 'office';

    return {
        city: address.city,
        deliveryMethod: address.deliveryMethod,
        deliveryCompany: isOffice
            ? address.office?.courierName || ''
            : address.deliveryCompany || '',
        address: isOffice ? '' : address.address || '',
        office: isOffice ? address.office : null,
    };
}

export async function fetchCourierOffices(city, deliveryCompany) {
    let result = [];
    if (deliveryCompany === 'econt') {
        result = await econtApi.getByCity(city);
    } else if (deliveryCompany === 'speedy') {
        result = await speedyApi.getByCity(city);
    }

    const officesData = result.find(r => normalizeAddress(r.city).includes(normalizeAddress(city)))?.offices || [];
    return normalizeOffices(officesData.map(o => o.toObject?.() || o._doc || o), deliveryCompany, city);
}
