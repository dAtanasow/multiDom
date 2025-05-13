const express = require("express");
const router = express.Router();
const { getOfficesByCity, getOfficeById } = require("../controllers/speedy");

router.get("/", getOfficesByCity);
router.get("/:id", getOfficeById);

module.exports = router;
