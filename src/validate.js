var joi = require('joi');
var esprima = require('esprima');

var schema = require('./schema');

var joiOptions = {
    convert: true,
    abortEarly: false,
    allowUnknown: false
};

module.exports = function(logger, rawData) {

    return new Promise((resolve, reject) => {

        joi.validate(rawData, schema, joiOptions, (err, data) => {
            if (err) {
                return reject(err);
            }

            if (data.userAnalyzeFn) {
                try {
                    var options = {
                        tolerant: true,
                        loc: true
                    };

                    var syntax = esprima.parse(data.userAnalyzeFn, options);

                    // if (logger) {
                    //     logger.trace(
                    //         'custom analyze syntax tree',
                    //         require('util').inspect(syntax, {
                    //             depth: null
                    //         })
                    //     );
                    // }

                    if (syntax.errors.length) {
                        var error = new Error('invalid analyze function');
                        error.errors = syntax.errors;
                        return reject(error);
                    }

                    resolve(data);

                } catch (e) {
                    var error = new Error('invalid analyze function');
                    error.errors = [e];
                    reject(error);
                }
            } else {
                resolve(data);
            }


        });

    });

};