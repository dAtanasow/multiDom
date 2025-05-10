const Office = require("../models/Office");

const normalizeCity = (cityStr) => {
    return cityStr.split("(")[0].trim().toLowerCase();
};

const getOfficesByCity = async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ message: "Моля, посочете град." });
    }

    try {
        const all = await Office.find({});
        const normalizedQuery = city.trim().toLowerCase();

        const matching = all.filter(entry => {
            return normalizeCity(entry.city) === normalizedQuery;
        });

        res.status(200).json(
            matching.map(o => ({
                ...o.toObject(),
                _id: o._id.toString(),
                offices: Array.isArray(o.offices)
                    ? o.offices.map(of => ({
                        ...of,
                        _id: of._id?.toString?.() || undefined
                    }))
                    : [],
            }))
        );

    } catch (err) {
        console.error("Грешка при търсене на офиси на Спиди:", err);
        res.status(500).json({ message: "Грешка при зареждане на офисите на Спиди." });
    }
};

const getOfficeById = async (req, res) => {
    try {
        const office = await Office.findById(req.params.id);
        if (!office) {
            return res.status(404).json({ message: "Офисът на Спиди не е намерен." });
        }
        res.status(200).json(office);
    } catch (err) {
        console.error("Грешка при намиране на офис на Спиди:", err);
        res.status(500).json({ message: "Грешка при зареждане на офис на Спиди." });
    }
};

module.exports = {
    getOfficesByCity,
    getOfficeById,
};
