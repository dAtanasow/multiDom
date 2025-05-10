export const useTotals = (cart, deliveryCompany, deliveryMethod, deliveryPrices) => {
    const productTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryTotal =
        deliveryCompany && deliveryMethod
            ? deliveryPrices[deliveryCompany] + (deliveryMethod === "address" ? 1.5 : 0)
            : 0;
    const total = productTotal + deliveryTotal;

    return { productTotal, deliveryTotal, total };
};
