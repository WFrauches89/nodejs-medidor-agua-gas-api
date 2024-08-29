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
exports.uploadRouter = void 0;
const express_1 = __importDefault(require("express"));
const imageService_1 = require("../services/imageService");
const express_validator_1 = require("express-validator");
const ErrorHandler_1 = require("../validators/ErrorHandler");
const uploadValidator_1 = require("../validators/uploadValidator");
const logger_1 = __importDefault(require("../validators/logger"));
const geminiApiError_1 = require("../validators/geminiApiError");
exports.uploadRouter = express_1.default.Router();
/**
 * @openapi
 * /upload:
 *   post:
 *     summary: Upload de uma medição
 *     description: Permite o upload de uma imagem para medição e validação.
 *     requestBody:
 *       description: Dados da medição.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 example: "base64string"
 *               customer_code:
 *                 type: string
 *                 example: "customer123"
 *               measure_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-08-29T12:00:00Z"
 *               measure_type:
 *                 type: string
 *                 enum: [WATER, GAS]
 *                 example: "WATER"
 *     responses:
 *       200:
 *         description: Medição carregada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Medição carregada com sucesso"
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro interno do servidor
 */
exports.uploadRouter.post('/', uploadValidator_1.uploadValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return ErrorHandler_1.ErrorHandler.handleValidationError(res, errors);
    }
    const { image, customer_code, measure_datetime, measure_type } = req.body;
    const measureTypeEnum = measure_type.toUpperCase();
    try {
        const result = yield (0, imageService_1.processImage)(image, customer_code, measure_datetime, measureTypeEnum);
        res.status(200).json(result);
    }
    catch (error) {
        if (error instanceof geminiApiError_1.GeminiApiError) {
            logger_1.default.error(`Erro ao se comunicar com a API Gemini: ${error.message}`);
            ErrorHandler_1.ErrorHandler.handleApiError(res, 'Erro ao se comunicar com a API Gemini');
        }
        else {
            logger_1.default.error(`Erro no upload: ${error instanceof Error ? error.message : error}`);
            ErrorHandler_1.ErrorHandler.handleCustomError(res, error);
        }
    }
}));
