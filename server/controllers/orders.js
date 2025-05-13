const Order = require("../models/Order");
const { sendOrderConfirmationEmail } = require("../utils/email");

const createOrder = async (req, res) => {
    try {
        const orderData = req.body;

        const total = orderData.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        const grandTotal = total + (orderData.deliveryTotal || 0);
        const order = await Order.create(orderData);

        let officeDetails = order.office || undefined;
        console.log("🧪 Съдържание на order.office:", JSON.stringify(order.office, null, 2));

        await sendOrderConfirmationEmail(order.email, {
            ...orderData,
            total: grandTotal,
            orderId: order._id,
            officeDetails
        });

        res.status(201).json({
            message: "Поръчката е приета и имейлът е изпратен.",
            orderId: order._id,
        });
    } catch (error) {
        console.error("Грешка при създаване на поръчка:", error);
        res.status(500).json({ message: "Грешка при обработка на поръчката." });
    }
};

module.exports = { createOrder };
