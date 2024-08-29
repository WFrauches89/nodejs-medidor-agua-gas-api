import { body, ValidationChain } from 'express-validator';

export const uploadValidation: ValidationChain[] = [
  body('image').notEmpty().withMessage('Image is required'),
  body('customer_code').notEmpty().withMessage('Customer code is required'),
  body('measure_datetime')
    .notEmpty()
    .withMessage('Measure datetime is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('measure_type')
    .notEmpty()
    .withMessage('Measure type is required')
    .isIn(['WATER', 'GAS'])
    .withMessage('Measure type must be either WATER or GAS'),
];
