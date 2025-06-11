import { Link } from "react-router-dom";

export default function OrderProductCard({ product }) {
    const {
        _id,
        name,
        image,
        price,
        discountPrice,
        originalPrice,
        quantity,
    } = product;

    const hasDiscount =
        typeof discountPrice === "number" &&
        typeof originalPrice === "number" &&
        discountPrice < originalPrice;

    const discountAmount = hasDiscount ? (originalPrice - discountPrice).toFixed(2) : null;
    const discountPercent = hasDiscount ? Math.round((1 - discountPrice / originalPrice) * 100) : null;

    return (
        <Link to={`/product/${_id}`} className="group block w-full h-full">
            <div className="flex flex-col justify-between h-full w-full max-w-[320px] mx-auto bg-white p-3 rounded-2xl border border-gray-200 shadow-md group-hover:shadow-lg transition-all duration-300 text-center">
                <div className="relative w-48 h-48 mx-auto">
                    <img
                        src={image || "/placeholder.png"}
                        alt={name}
                        className="w-full h-full object-contain rounded-xl border border-gray-300 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1 right-1 bg-blue-600 text-white text-[11px] px-2 py-[2px] rounded-full font-medium shadow-sm">
                        {quantity} бр.
                    </div>
                    {hasDiscount && (
                        <div className="absolute bottom-1 left-1 bg-green-600 text-white text-[11px] px-2 py-[2px] rounded-full font-semibold shadow-sm">
                            -{discountPercent}%
                        </div>
                    )}
                </div>

                <div className="min-h-[3rem] flex items-center justify-center">
                    <p className="text-base font-semibold text-gray-800 line-clamp-2">
                        {name}
                    </p>
                </div>

                <div className="min-h-[2rem] text-base">
                    {hasDiscount ? (
                        <>
                            <span className="line-through text-red-500 mr-1">{price.toFixed(2)} лв.</span>
                            <span className="text-green-600 font-semibold mr-1">{discountPrice.toFixed(2)} лв.</span>
                            <span className="text-blue-600 text-sm">(-{discountAmount} лв.)</span>
                        </>
                    ) : (
                        <span className="text-gray-800 font-medium">
                            {price?.toFixed(2)} лв.
                        </span>
                    )}
                </div>

                <span className="mt-3 text-sm text-gray-400 group-hover:text-blue-600 transition">
                    Виж детайли →
                </span>
            </div>
        </Link>
    );
}