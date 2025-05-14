const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Достъпът е отказан. Само администратори." });
    }
    next();
};

module.exports = { isAdmin };
