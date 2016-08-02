var joi = require('joi');

var schema = require('./schema');

var joiOptions = {
    convert: true,
    abortEarly: false,
    allowUnknown: false
};

module.exports = function (rawData) {

    return new Promise((resolve, reject) => {

        joi.validate(rawData, schema, joiOptions, (err, data) => {
            if (err) {
                return reject(err);
            }

            resolve(data);
        });

    });

};
