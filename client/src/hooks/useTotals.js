export function useTotals(cart, form, deliveryPrices) {
    const totalStandard = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const totalWithDiscount = cart.reduce((sum, item) => {
        const price = item.discountPrice && item.discountPrice < item.price
            ? item.discountPrice
            : item.price;
        return sum + price * item.quantity;
    }, 0);

    const fallbackPrice = deliveryPrices?.[form.deliveryCompany]?.[form.deliveryMethod] || 0;
    const deliveryTotal = typeof form.deliveryTotal === 'number'
        ? form.deliveryTotal
        : fallbackPrice;

    const total = totalWithDiscount + deliveryTotal;
    const totalDiscount = totalStandard - totalWithDiscount;

    return { productTotal: totalWithDiscount, deliveryTotal, total, totalStandard, totalDiscount };
}
