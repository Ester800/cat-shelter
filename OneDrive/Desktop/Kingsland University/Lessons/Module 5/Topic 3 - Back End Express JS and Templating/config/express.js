const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

module.exports = (app) => {
    
    //TODO: Setup the view engine
    app.set('view engine', 'express-handlebars');

    //TODO: Setup the body parser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    //TODO: Setup the static files
    app.use(express.static(path.join(__dirname, 'static')));
    

};