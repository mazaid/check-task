var joi = require('joi');

module.exports = {
    id: joi.string().guid().required(),
    execTaskId: joi.string().guid(),
    checker: joi.string().required(),
    timeout: joi.number().min(1).default(60).description('task execution timeout in seconds, default = 60'),
    data: joi.object().unknown(true).required(),

    // TODO tests
    status: joi.string().valid(['created', 'queued', 'started', 'finished']).required(),

    // TODO tests
    rawResult: joi.any().description('parsed exec result'),

    result: joi.object().unknown(true).keys({
        status: joi.string().valid(['pass', 'fail', 'warn']).required(),
        message: joi.string(),
    }),
    creationDate: joi.number().integer().min(0).required(),

    // TODO tests
    queuedDate: joi.number().integer().min(0),

    startDate: joi.number().integer().min(0),
    finishDate: joi.number().integer().min(0)
};
