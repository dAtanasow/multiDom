export default function formatCartItems(items) {
    return (items || [])
        .filter(item =>
            (item.product && item.product._id) ||
            (item._id && item.name && typeof item.price === "number")
        )
        .map(item => {
            const product = item.product || item;
            return {
                _id: product._id,
                name: product.name,
                price: product.price,
                images: product.images || [],
                quantity: item.quantity
            };
        });
}
