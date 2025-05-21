const Product = require("../models/Product");
const User = require("../models/User");

async function getUserAddresses(req, res) {
    try {
        const user = await User.findById(req.user._id);
        res.json(user.addresses || []);
    } catch (err) {
        console.error("Error loading addresses:", err);
        res.status(500).json({ message: "Error loading addresses" });
    }
}

async function addUserAddress(req, res) {
    const { label, deliveryMethod, city, address, office } = req.body;
    console.log("📦 Получени данни за адрес:", { label, deliveryMethod, city, address, office });

    if (
        deliveryMethod === "address" &&
        !address?.trim()
    ) {
        return res.status(400).json({ message: "Липсва адрес за личен адрес" });
    }

    if (
        deliveryMethod === "office" &&
        (!office?.name?.trim() || !office?.address?.trim() || !office?.courierName?.trim())
    ) {
        return res.status(400).json({ message: "Липсват данни за офис" });
    }

    try {
        const user = await User.findById(req.user._id);

        const newEntry = {
            label: label.trim(),
            deliveryMethod,
            city: city.trim(),
            address: deliveryMethod === "address" ? address.trim() : undefined,
            office: deliveryMethod === "office" ? {
                name: office.name.trim(),
                address: office.address.trim(),
                courierName: office.courierName.trim(),
            } : undefined
        };

        user.addresses.push(newEntry);
        await user.save();
        res.json(user.addresses);
    } catch (err) {
        console.error("Error adding address:", err);
        res.status(500).json({ message: "Error adding address" });
    }
}

async function deleteUserAddress(req, res) {
    const index = parseInt(req.params.index);
    if (isNaN(index)) return res.status(400).json({ message: "Invalid index" });

    try {
        const user = await User.findById(req.user._id);
        if (!user.addresses || index < 0 || index >= user.addresses.length) {
            return res.status(404).json({ message: "Address not found" });
        }
        user.addresses.splice(index, 1);
        await user.save();
        res.json(user.addresses);
    } catch (err) {
        console.error("Error deleting address:", err);
        res.status(500).json({ message: "Error deleting address" });
    }
}

const editProfile = async (req, res, next) => {
    const userId = req.user?._id;
    const { firstName, lastName, phone, email } = req.body;

    if (!userId) {
        return next(new CustomError("Неавторизиран достъп.", 401));
    }

    if (!firstName || !lastName || !phone || !email) {
        return next(new CustomError("Моля, попълнете всички полета.", 400));
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
        const user = await User.findById(userId);
        if (!user) {
            return next(new CustomError("Потребителят не е намерен.", 404));
        }

        const isSame =
            user.firstName === firstName &&
            user.lastName === lastName &&
            user.phone === phone &&
            user.email === normalizedEmail;

        if (isSame) {
            return res.status(200).json({
                message: "Няма направени промени.",
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    role: user.role || "user",
                },
            });
        }

        if (normalizedEmail !== user.email) {
            const emailExists = await User.findOne({ email: normalizedEmail });
            if (emailExists && emailExists._id.toString() !== userId.toString()) {
                return next(new CustomError("Имейлът вече се използва от друг потребител.", 400));
            }
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.phone = phone;
        user.email = normalizedEmail;

        await user.save();

        res.status(200).json({
            message: "Профилът е обновен успешно.",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role || "user",
            },
        });
    } catch (err) {
        next(err);
    }
};

const toggleFavorite = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'Потребителят не е намерен' });

        const index = user.favorites.indexOf(productId);

        if (index > -1) {
            user.favorites.splice(index, 1);
        } else {
            user.favorites.push(productId);
        }

        await user.save();
        res.json({ favorites: user.favorites });
    } catch (err) {
        res.status(500).json({ message: 'Грешка при запазване на любими' });
    }
};

const getFavoritesList = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("favorites");
        res.json(user.favorites || []);
    } catch (err) {
        console.error("Грешка при взимане на любими продукти:", err);
        res.status(500).json({ message: "Грешка при зареждане на любими" });
    }
};

module.exports = {
    getUserAddresses,
    addUserAddress,
    deleteUserAddress,
    editProfile,
    toggleFavorite,
    getFavoritesList,
};