global.__basedir = __dirname;
require('dotenv').config();

const config = require('./config/config');
const cors = require('cors');
const express = require('express');
const dbConnector = require('./config/db');
const apiRouter = require('./router');

dbConnector()
    .then(() => {
        const app = express();

        const corsOptions = {
            origin: Array.isArray(config.origin) ? config.origin : [config.origin],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        };

        app.set('trust proxy', 1);
        app.use(cors(corsOptions));

        require('./config/express')(app);

        app.use('/api', apiRouter);

        app.listen(config.port, () => {
            console.log(`✅ Server is running on port ${config.port}`);
        });

    })
    .catch(console.error);
