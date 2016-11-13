const urlApi = require('url');

const connStringObj = {};

const mongo = {
    protocol: 'mongodb',
    slashes: true,
    port: 27017,
    hostname: 'localhost',
    pathname: 'identity'
};


connStringObj.mongo = urlApi.format(mongo);

Object.freeze(connStringObj);

module.exports = connStringObj;
