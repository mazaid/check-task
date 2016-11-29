var joi = require('joi');
var esprima = require('esprima');

var schema = require('./schema');

var joiOptions = {
    convert: true,
    abortEarly: false,
    allowUnknown: false
};

var checkUserAnalyzeFnSyntax = function (userAnalyzeFn) {

    return new Promise((resolve, reject) => {

        var options = {
            tolerant: true,
            loc: true
        };

        var syntax = esprima.parse(userAnalyzeFn, options);

        if (syntax.errors.length) {
            var error = new Error('invalid analyze function');
            error.errors = syntax.errors;
            return reject(error);
        }

        resolve();
    });

};

var validateUserAnalyzeFn = function (rawUserAnalyzeFn) {

    return new Promise((resolve, reject) => {
        var error;

        try {

            var userAnalyzeFn = `function userAnalyzeFn(logger, data, result, libs) {

                return new Promise(function(resolve) {
                    ${rawUserAnalyzeFn}
                });

            }`;

            checkUserAnalyzeFnSyntax(userAnalyzeFn)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });

        } catch (e) {
            error = new Error('invalid analyze function');
            error.errors = [e];
            reject(error);
        }
    });

};

module.exports = function (logger, rawData) {

    return new Promise((resolve, reject) => {

        joi.validate(rawData, schema, joiOptions, (err, data) => {

            if (err) {
                return reject(err);
            }

            if (data.userAnalyzeFn) {
                validateUserAnalyzeFn(data.userAnalyzeFn)
                    .then(() => {
                        resolve(data);
                    })
                    .catch((error) => {
                        reject(error);
                    });

            } else {
                resolve(data);
            }

        });

    });

};
