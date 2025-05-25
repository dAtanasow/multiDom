export function useTotals(cart, deliveryCompany, deliveryMethod, deliveryPrices) {


    const totalStandard = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    const totalWithDiscount = cart.reduce((sum, item) => {
        const price = item.discountPrice && item.discountPrice < item.price
            ? item.discountPrice
            : item.price;
        return sum + price * item.quantity;
    }, 0);

    const rawPrice = deliveryPrices[deliveryCompany];
    const price = typeof rawPrice === 'object'
        ? rawPrice[deliveryMethod] || 0
        : deliveryMethod === "address" ? rawPrice : 0;

    const deliveryTotal = price;
    const total = totalWithDiscount + deliveryTotal;
    const totalDiscount = totalStandard - totalWithDiscount;

    return { productTotal: totalWithDiscount, deliveryTotal, total, totalStandard, totalDiscount };
}
