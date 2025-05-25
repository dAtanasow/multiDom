global.__basedir = __dirname;
require('dotenv').config()
const cors = require('cors');
const express = require('express');
const dbConnector = require('./config/db');
const apiRouter = require('./router');
const config = require('./config/config');

dbConnector()
    .then(() => {
        const app = express();
        
        app.use(cors({
            origin: config.origin,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }));
        require('./config/express')(app);
        
        app.use('/api', apiRouter);

        app.listen(config.port, () => {
            console.log(`✅ Server is running on port ${config.port}`);
        });

    })
    .catch(console.error);