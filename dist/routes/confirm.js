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
exports.confirmRouter = void 0;
const express_1 = __importDefault(require("express"));
const measureService_1 = require("../services/measureService");
const ErrorHandler_1 = require("../validators/ErrorHandler");
const logger_1 = __importDefault(require("../validators/logger"));
exports.confirmRouter = express_1.default.Router();
/**
 * @openapi
 * /confirm:
 *   patch:
 *     summary: Confirmar uma medição
 *     description: Permite confirmar uma medição com um valor confirmado.
 *     requestBody:
 *       description: Dados da medição a ser confirmada.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               measure_uuid:
 *                 type: string
 *                 example: "uuid-1234-5678"
 *               confirmed_value:
 *                 type: number
 *                 example: 123.45
 *     responses:
 *       200:
 *         description: Medição confirmada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Medição confirmada com sucesso"
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Medição não encontrada
 *       409:
 *         description: Conflito - Medição já confirmada
 *       500:
 *         description: Erro interno do servidor
 */
exports.confirmRouter.patch('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, measureService_1.confirmMeasure)(req, res);
    }
    catch (error) {
        logger_1.default.error(`Erro ao confirmar medida: ${error instanceof Error ? error.message : error}`);
        if (error instanceof Error) {
            if (error.message === 'MEASURE_NOT_FOUND') {
                return ErrorHandler_1.ErrorHandler.handleNotFoundError(res, 'Leitura não encontrada');
            }
            else if (error.message === 'CONFIRMATION_DUPLICATE') {
                return ErrorHandler_1.ErrorHandler.handleConflictError(res, 'Leitura já confirmada');
            }
            else {
                return ErrorHandler_1.ErrorHandler.handleCustomError(res, error);
            }
        }
        return ErrorHandler_1.ErrorHandler.handleUnexpectedError(res);
    }
}));
