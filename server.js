
var express = require('express');
var fortune = require('fortune');
var nedbAdapter = require('fortune-nedb');
var jsonapi = require('fortune-json-api');

var store = fortune({
    adapter: {
        type: nedbAdapter,
        options: { dbPath: __dirname + '/.db' }
    },
    serializers: [{ type: jsonapi }]
});

store.defineType('recipe', {
    date:           {type: Date},
    name:           {type: String},
    description:    {type: String},
    ingredients: {
      link: 'ingredient',
      inverse: 'recipe',
      isArray: true
    }
});

store.defineType('ingredient', {
    name:           {type: String},
    recipe: {
      link: 'recipe',
      inverse: 'ingredients'
    }
});

var server = express();

server.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

server.use(fortune.net.http(store));

var port = process.env.PORT || 8080;

store.connect().then(function () {
    server.listen(port, function () {
        console.log('JSON API server started on port ' + port);
    });
});