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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processImage = void 0;
const axios_1 = __importDefault(require("axios"));
const MeasurementRepository_1 = require("../repositories/MeasurementRepository");
const is_base64_1 = __importDefault(require("is-base64"));
const ErrorHandler_1 = require("../validators/ErrorHandler");
const API_KEY = process.env.API_KEY || '';
const measurementRepository = new MeasurementRepository_1.MeasurementRepository();
const processImage = (image, customer_code, measure_datetime, measure_type) => __awaiter(void 0, void 0, void 0, function* () {
    if (measure_type !== 'WATER' && measure_type !== 'GAS') {
        throw new ErrorHandler_1.ErrorHandler.CustomError('INVALID_TYPE', 'Tipo de medição não permitido', 400);
    }
    if (!(0, is_base64_1.default)(image, { mimeRequired: true })) {
        throw new ErrorHandler_1.ErrorHandler.CustomError('INVALID_IMAGE_FORMAT', 'Formato de imagem inválido', 400);
    }
    try {
        const readingExists = yield measurementRepository.existsReading(customer_code, measure_type, measure_datetime);
        if (readingExists) {
            throw new ErrorHandler_1.ErrorHandler.CustomError('DOUBLE_REPORT', 'Leitura duplicada', 409);
        }
        const response = yield axios_1.default.post('https://api.gemini.example.com/process', { image }, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            },
        });
        const { image_url, measure_uuid, measure_value } = response.data;
        return {
            image_url,
            measure_value,
            measure_uuid,
        };
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            if (error.response) {
                const responseData = error.response.data;
                const message = typeof responseData === 'object' &&
                    responseData !== null &&
                    'message' in responseData
                    ? responseData.message
                    : 'Unknown API error';
                throw new ErrorHandler_1.ErrorHandler.CustomError('API_ERROR', `Erro da API: ${message}`, 500);
            }
            else if (error.request) {
                throw new ErrorHandler_1.ErrorHandler.CustomError('NO_RESPONSE', 'Nenhuma resposta recebida da API', 500);
            }
            else {
                throw new ErrorHandler_1.ErrorHandler.CustomError('REQUEST_ERROR', `Erro na requisição: ${error.message}`, 500);
            }
        }
        else {
            throw new ErrorHandler_1.ErrorHandler.CustomError('INTERNAL_ERROR', `Erro interno: ${error.message}`, 500);
        }
    }
});
exports.processImage = processImage;
