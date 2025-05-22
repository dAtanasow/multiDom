const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cookieSecret = process.env.COOKIESECRET;

module.exports = (app) => {
    app.use(express.json({ limit: "10mb" }));

    app.use((req, res, next) => {
        if (req.method === 'GET') {
            req.body = undefined;
        }
        next();
    });

    app.use(cookieParser(cookieSecret));

    app.use(express.static(path.resolve(__basedir, 'static')));

    app.use(express.urlencoded({ extended: true, limit: "10mb" }));
};
