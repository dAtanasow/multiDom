
const express = require('express');
const router = express.Router();
const { editProfile, getUserAddresses, addUserAddress, deleteUserAddress } = require("../controllers/profile");
const auth = require("../utils/auth");

router.get("/addresses", auth(), getUserAddresses);
router.post("/addresses", auth(), addUserAddress);
router.delete("/addresses/:index", auth(), deleteUserAddress);
router.put('/edit', auth(), editProfile);

module.exports = router;