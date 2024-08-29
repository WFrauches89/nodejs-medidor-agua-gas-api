"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadValidation = void 0;
const express_validator_1 = require("express-validator");
exports.uploadValidation = [
    (0, express_validator_1.body)('image').notEmpty().withMessage('Image is required'),
    (0, express_validator_1.body)('customer_code').notEmpty().withMessage('Customer code is required'),
    (0, express_validator_1.body)('measure_datetime')
        .notEmpty()
        .withMessage('Measure datetime is required')
        .isISO8601()
        .withMessage('Invalid date format'),
    (0, express_validator_1.body)('measure_type')
        .notEmpty()
        .withMessage('Measure type is required')
        .isIn(['WATER', 'GAS'])
        .withMessage('Measure type must be either WATER or GAS'),
];
