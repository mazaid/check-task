var joi = require('joi');

module.exports = {
    id: joi.string().guid().required(),

    checkId: joi.string().guid().default(null).allow(null),

    execTaskId: joi.string().guid().default(null).allow(null),

    checker: joi.string().required(),
    timeout: joi.number().min(1).default(60).description('task execution timeout in seconds, default = 60'),
    data: joi.object().unknown(true).required(),

    status: joi.string().valid(['created', 'queued', 'started', 'finished']).required(),

    rawResult: joi.any().description('parsed exec result').default(null).allow(null),

    result: joi.object().unknown(true).keys({
        status: joi.string().valid(['pass', 'fail', 'warn']).required(),
        message: joi.string()
    }).default(null).allow(null),

    creationDate: joi.number().integer().min(0).required(),
    timeoutDate: joi.number().integer().min(0).required(),

    // TODO tests
    queuedDate: joi.number().integer().min(0).default(null).allow(null),

    startDate: joi.number().integer().min(0).default(null).allow(null),
    finishDate: joi.number().integer().min(0).default(null).allow(null)
};
