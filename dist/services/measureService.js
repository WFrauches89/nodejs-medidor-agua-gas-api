"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmMeasure = confirmMeasure;
exports.getMeasures = getMeasures;
const MeasurementRepository_1 = require("../repositories/MeasurementRepository");
const ErrorHandler_1 = require("../validators/ErrorHandler");
const measurementRepository = new MeasurementRepository_1.MeasurementRepository();
function confirmMeasure(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { measure_uuid, confirmed_value } = req.body;
            if (!measure_uuid || !confirmed_value) {
                return ErrorHandler_1.ErrorHandler.handleValidationError(res, {
                    array: () => [
                        { param: 'measure_uuid', msg: 'UUID da medição é necessário' },
                        { param: 'confirmed_value', msg: 'Valor confirmado é necessário' },
                    ],
                });
            }
            const measurement = yield measurementRepository.findByUUID(measure_uuid);
            if (!measurement) {
                return ErrorHandler_1.ErrorHandler.handleNotFoundError(res, 'Measurement not found');
            }
            if (measurement.has_confirmed) {
                return ErrorHandler_1.ErrorHandler.handleConflictError(res, 'Measurement already confirmed');
            }
            measurement.confirmed_value = confirmed_value;
            measurement.has_confirmed = true;
            yield measurementRepository.saveMeasurement(measurement);
            return res.status(200).json({
                message: 'Measurement confirmed successfully',
            });
        }
        catch (error) {
            return ErrorHandler_1.ErrorHandler.handleCustomError(res, error);
        }
    });
}
function getMeasures(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { customer_code, measure_type } = req.query;
        if (!customer_code || typeof customer_code !== 'string') {
            return ErrorHandler_1.ErrorHandler.handleValidationError(res, {
                array: () => [
                    {
                        param: 'customer_code',
                        msg: 'Código do cliente é necessário',
                    },
                ],
            });
        }
        let measureTypeEnum;
        if (measure_type) {
            const measureTypeValue = Array.isArray(measure_type)
                ? measure_type[0]
                : measure_type;
            if (typeof measureTypeValue === 'string') {
                const upperCaseMeasureType = measureTypeValue.toUpperCase();
                if (['WATER', 'GAS'].includes(upperCaseMeasureType)) {
                    measureTypeEnum = upperCaseMeasureType;
                }
                else {
                    return ErrorHandler_1.ErrorHandler.handleValidationError(res, {
                        array: () => [
                            {
                                param: 'measure_type',
                                msg: 'Tipo de medição não permitida',
                            },
                        ],
                    });
                }
            }
            else {
                return ErrorHandler_1.ErrorHandler.handleValidationError(res, {
                    array: () => [
                        {
                            param: 'measure_type',
                            msg: 'Tipo de medição é necessário',
                        },
                    ],
                });
            }
        }
        try {
            const measurements = yield measurementRepository.getMeasurements(customer_code, new Date().toISOString(), measureTypeEnum);
            return res.status(200).json(measurements);
        }
        catch (error) {
            return ErrorHandler_1.ErrorHandler.handleCustomError(res, error);
        }
    });
}
