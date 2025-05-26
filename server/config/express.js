const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSecret = process.env.COOKIESECRET;

module.exports = (app) => {
    app.use(express.json({ limit: "10mb" }));
    app.use(cookieParser(cookieSecret));
    app.use(express.urlencoded({ extended: true, limit: "10mb" }));
};
