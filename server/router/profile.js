
const express = require('express');
const router = express.Router();
const { editProfile, getUserAddresses, addUserAddress, deleteUserAddress, toggleFavorite } = require("../controllers/profile");
const auth = require("../utils/auth");

router.get("/addresses", auth(), getUserAddresses);
router.post("/addresses", auth(), addUserAddress);
router.delete("/addresses/:index", auth(), deleteUserAddress);
router.post('/favorites/toggle', auth(), toggleFavorite);
router.put('/edit', auth(), editProfile);

module.exports = router;