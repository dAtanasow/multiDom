const express = require("express");
const router = express.Router();
const { getOfficesByCity, getOfficeById} = require("../controllers/econt");


router.get("/", getOfficesByCity);
router.get("/:id", getOfficeById);

module.exports = router;
