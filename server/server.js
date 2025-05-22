global.__basedir = __dirname;
require('dotenv').config()
const dbConnector = require('./config/db');
const apiRouter = require('./router');
const cors = require('cors');
const express = require('express');

dbConnector()
    .then(() => {
        const config = require('./config/config');
        console.log('✅ ENV:', process.env.NODE_ENV);
        console.log('✅ DB URL:', config.dbURL);
        console.log("✅ ENV MONGO_URI:", process.env.MONGO_URI);


        const app = express();
        require('./config/express')(app);

        app.use(cors({
            origin: config.origin,
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization'],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        }));

        app.use('/api', apiRouter);

        app.listen(config.port, () => {
            console.log(`✅ Server is running on port ${config.port}`);
        });

    })
    .catch(console.error);