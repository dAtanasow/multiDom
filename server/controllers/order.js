const Order = require("../models/Order");
const Counter = require("../models/Counter");
const Product = require("../models/Product")
const { sendOrderConfirmationEmail } = require("../utils/email");
const getNextNumber = require("../utils/getNextNumber");

const createOrder = async (req, res) => {
    try {
        const orderData = req.body;

        const totalStandard = orderData.items.reduce(
            (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
            0
        );

        const total = orderData.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const totalDiscount = totalStandard - total;

        let rawDelivery = orderData.deliveryTotal;
        if (typeof rawDelivery !== "number") {
            rawDelivery = parseFloat(rawDelivery);
            if (isNaN(rawDelivery)) rawDelivery = 0;
        }
        orderData.deliveryTotal = rawDelivery;
        const grandTotal = total + orderData.deliveryTotal;

        if (orderData.invoice?.useInvoice) {
            orderData.invoiceNumber = await getNextNumber("invoiceNumber");

            orderData.invoice = {
                useInvoice: true,
                companyName: orderData.invoice.companyName,
                bulstat: orderData.invoice.bulstat,
                vatNumber: orderData.invoice.vatNumber,
                address: orderData.invoice.address,
                mol: orderData.invoice.mol,
            }

        } else {
            orderData.invoice = { useInvoice: false };
        }

        orderData.orderNumber = await getNextNumber("orderNumber");

        const order = await Order.create(orderData);

        let officeDetails = order.office || undefined;
        await sendOrderConfirmationEmail(order.email, {
            ...orderData,
            total: grandTotal,
            totalStandard,
            totalDiscount,
            orderId: order._id,
            officeDetails
        });

        res.status(201).json({
            message: "Поръчката е приета и имейлът е изпратен.",
            orderId: order._id,
        });

    } catch (error) {
        console.error("❌ Грешка при създаване на поръчка:", error);
        res.status(500).json({ message: "Грешка при обработка на поръчката." });
    }
}

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Поръчката не е намерена." });
        }

        res.json(order);
    } catch (error) {
        console.error("Грешка при извличане на поръчка:", error);
        res.status(500).json({ message: "Грешка при зареждане на поръчката." });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Грешка при зареждане на всички поръчки:", error);
        res.status(500).json({ message: "Грешка при зареждане на поръчките." });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: "Поръчката не е намерена" });

        const previousStatus = order.status;

        if (status === "pending" && previousStatus === "new") {
            for (const item of order.items) {
                const product = await Product.findById(item.productId);
                if (product) {
                    product.quantity = Math.max(0, product.quantity - item.quantity);
                    await product.save();
                }
            }
        }

        if (
            status === "canceled" &&
            (previousStatus === "pending" || previousStatus === "completed")
        ) {
            for (const item of order.items) {
                const product = await Product.findById(item.productId);
                if (product) {
                    product.quantity += item.quantity;
                    await product.save();
                }
            }
        }

        order.status = status;
        await order.save();

        res.json({ message: "Статусът е обновен", order });
    } catch (err) {
        console.error("Грешка при обновяване на статуса:", err);
        res.status(500).json({ message: "Вътрешна грешка при обновяване" });
    }
};


module.exports = {
    createOrder,
    getOrderById,
    getAllOrders,
    updateOrderStatus
};
