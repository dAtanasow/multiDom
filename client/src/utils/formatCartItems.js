export default function formatCartItems(items) {
    return (items || [])
        .filter(item => item.product && item.product._id)
        .map(item => ({
            _id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            images: item.product.images,
            quantity: item.quantity,
        }));
}