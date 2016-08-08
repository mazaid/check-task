var joi = require('joi');

module.exports = {
    id: joi.string().guid().required(),
    execTaskId: joi.string().guid(),
    checker: joi.string().required(),
    data: joi.object().unknown(true).required(),
    result: joi.object().unknown(true).keys({
        status: joi.string().valid(['pass', 'fail', 'warn']).required(),
        message: joi.string(),
    }),
    creationDate: joi.date().timestamp('unix'),
    startDate: joi.date().timestamp('unix'),
    finishDate: joi.date().timestamp('unix')
};
