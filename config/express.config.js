'use strict';

let bodyParser = require('body-parser');
let cors = require('cors');
let jsonwebtoken = require("jsonwebtoken");
let Review = require('../api/models/reviewListModel');
let User = require('../api/models/userModel');

module.exports = (app) => {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
    app.use(
        cors({
            credentials: true,
            origin: 'http://localhost:4200',
            // origin: 'https://movies-blog.herokuapp.com'
        })
    );

    app.use(function(req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
        if (err) req.user = undefined;
        req.user = decode;
        next();
        });
    } else {
        req.user = undefined;
        next();
    }
    });

    let routes = require('../api/routes/reviewListRoutes')
    let categoriesRoutes = require('../api/routes/categoriesRoutes');
    routes(app);
    categoriesRoutes(app);
};