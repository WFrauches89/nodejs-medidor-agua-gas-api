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
exports.listRouter = void 0;
const express_1 = __importDefault(require("express"));
const measureService_1 = require("../services/measureService");
const ErrorHandler_1 = require("../validators/ErrorHandler");
exports.listRouter = express_1.default.Router();
/**
 * @openapi
 * /measures:
 *   get:
 *     summary: Listar medições
 *     description: Recupera uma lista de medições com base no código do cliente e tipo de medição.
 *     parameters:
 *       - name: customer_code
 *         in: query
 *         description: Código do cliente para filtrar as medições.
 *         required: true
 *         schema:
 *           type: string
 *           example: "customer123"
 *       - name: measure_type
 *         in: query
 *         description: Tipo de medição para filtrar as medições.
 *         required: false
 *         schema:
 *           type: string
 *           enum: [WATER, GAS]
 *           example: "WATER"
 *     responses:
 *       200:
 *         description: Lista de medições retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "uuid-1234-5678"
 *                   customer_code:
 *                     type: string
 *                     example: "customer123"
 *                   measure_datetime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-08-29T12:00:00Z"
 *                   measure_type:
 *                     type: string
 *                     enum: [WATER, GAS]
 *                     example: "WATER"
 *                   measure_value:
 *                     type: number
 *                     example: 123.45
 *                   confirmed_value:
 *                     type: number
 *                     example: 123.45
 *                   image_url:
 *                     type: string
 *                     example: "http://example.com/image.jpg"
 *                   has_confirmed:
 *                     type: boolean
 *                     example: true
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro interno do servidor
 */
exports.listRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { measure_type } = req.query;
    const customer_code = req.query.customer_code;
    let measureTypeEnum;
    if (measure_type) {
        const measureTypeValue = Array.isArray(measure_type)
            ? measure_type[0]
            : measure_type;
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
    if (!customer_code) {
        return ErrorHandler_1.ErrorHandler.handleValidationError(res, {
            array: () => [
                {
                    param: 'customer_code',
                    msg: 'Código do cliente é necessário',
                },
            ],
        });
    }
    try {
        const measures = yield (0, measureService_1.getMeasures)(req, res);
        if (!Array.isArray(measures)) {
            throw new Error('Resposta inválida do getMeasures');
        }
        if (measures.length === 0) {
            return ErrorHandler_1.ErrorHandler.handleNotFoundError(res, 'Nenhuma leitura encontrada');
        }
        else {
            return res.status(200).json({ customer_code, measures });
        }
    }
    catch (error) {
        return ErrorHandler_1.ErrorHandler.handleCustomError(res, error);
    }
}));
