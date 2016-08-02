'use strict';

var ErrorCodes = {
    NO_DATA: 'noData',
    INVALID_DATA: 'invalidData'
};

var error = require('mazaid-error/create')(ErrorCodes);

var validate = require('./validate');

var entityName = 'checkTask';

/**
 * @class
 */
class CheckTask {

    /**
     * @constructor
     * @param  {Object} rawTask
     */
    constructor(rawTask) {

        this.ErrorCodes = ErrorCodes;

        this._valid = false;

        this._task = {
            id: null,
            execTaskId: null,
            checker: null,
            data: {},
            result: null,
            creationDate: null,
            startDate: null,
            finishDate: null
        };

        if (rawTask) {
            this._task = rawTask;
        }

    }

    /**
     * id getter
     *
     * @return {String}
     */
    get id() {
        return this._task.id;
    }

    /**
     * id setter
     *
     * @param  {String} value
     */
    set id(value) {
        this._task.id = value;
    }

    /**
     * execTaskId getter
     *
     * @return {String}
     */
    get execTaskId() {
        return this._task.execTaskId;
    }

    /**
     * execTaskId setter
     *
     * @param  {String} value
     */
    set execTaskId(value) {
        this._task.execTaskId = value;
    }

    /**
     * checker getter
     *
     * @return {String}
     */
    get checker() {
        return this._task.checker;
    }

    /**
     * checker setter
     *
     * @param  {String} value
     */
    set checker(value) {
        this._task.checker = value;
    }

    /**
     * data getter
     *
     * @return {Object}
     */
    get data() {
        return this._task.data;
    }

    /**
     * data setter
     *
     * @param  {Object} value
     */
    set data(value) {
        this._task.data = value;
    }

    /**
     * result getter
     *
     * @return {Object}
     */
    get result() {
        return this._task.result;
    }

    /**
     * result setter
     *
     * @param  {Object} value
     */
    set result(value) {
        this._task.result = value;
    }

    /**
     * set creationDate
     */
    created() {
        this._task.creationDate = this._time();
    }

    /**
     * set startDate
     */
    started() {
        this._task.startDate = this._time();
    }

    /**
     * set finishDate
     */
    finished() {
        this._task.finishDate = this._time();
    }

    /**
     * is valid
     *
     * @return {Boolean}
     */
    isValid() {
        return this._valid;
    }

    /**
     * validate task data
     *
     * @return {Promise}
     */
    validate() {

        return new Promise((resolve, reject) => {
            validate(this._task)
                .then((validData) => {
                    this._valid = true;
                    this._task = validData;
                    resolve();
                })
                .catch((error) => {
                    if (error.name === 'ValidationError') {
                        reject(
                            this._error(
                                'invalid data',
                                ErrorCodes.INVALID_DATA
                            )
                            .setList(error.details)
                        );
                    } else {
                        reject(error);
                    }
                });
        });

    }

    /**
     * serialize task
     *
     * @return {Promise}
     */
    serialize() {

        return new Promise((resolve, reject) => {
            if (!this._task || Object.keys(this._task).length === 0) {
                return reject(this._error('no data', ErrorCodes.NO_DATA));
            }

            this.validate()
                .then(() => {
                    resolve(JSON.stringify(this._task));
                })
                .catch((error) => {
                    reject(error);
                });

        });

    }

    /**
     * deserialize task data
     *
     * @param  {String} raw
     * @return {Promise}
     */
    deserialize(raw) {

        return new Promise((resolve, reject) => {

            if (!raw) {
                return reject(this._error('empty serialized data', ErrorCodes.NO_DATA));
            }

            try {
                var parsed = JSON.parse(raw);
            } catch (e) {
                return reject(this._error('invalid serialized data', ErrorCodes.INVALID_DATA));
            }

            if (
                typeof parsed !== 'object' ||
                Object.keys(parsed).length === 0
            ) {
                return reject(this._error('invalid serialized data', ErrorCodes.INVALID_DATA));
            }

            this._task = parsed;

            this.validate()
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });

        });

    }

    /**
     * get task as object
     *
     * @return {Object}
     */
    toObject() {
        return JSON.parse(JSON.stringify(this._task));
    }

    /**
     * erro helper
     *
     * @param  {String} message
     * @param  {String} code
     * @return {Error}
     */
    _error(message, code) {
        return error(message, code, entityName);
    }

    /**
     * get timestamp
     *
     * @return {Number}
     */
    _time() {
        return (new Date()).getTime() / 1000;
    }

}

module.exports = CheckTask;
