"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const logger_1 = __importDefault(require("./logger"));
const uuid_1 = require("uuid");
class ErrorHandler {
    static handleValidationError(res, errors) {
        const errorId = (0, uuid_1.v4)();
        logger_1.default.error(`Validation Error [${errorId}]: Invalid data in request`, {
            errors: errors.array(),
        });
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Dados inválidos no corpo da requisição.',
            error_id: errorId,
            errors: errors.array(),
        });
    }
    static handleNotFoundError(res, message) {
        const errorId = (0, uuid_1.v4)();
        logger_1.default.error(`Not Found [${errorId}]: ${message}`);
        return res.status(404).json({
            error_code: 'NOT_FOUND',
            error_description: message,
            error_id: errorId,
        });
    }
    static handleConflictError(res, message) {
        const errorId = (0, uuid_1.v4)();
        logger_1.default.error(`Conflict Error [${errorId}]: ${message}`);
        return res.status(409).json({
            error_code: 'CONFLICT',
            error_description: message,
            error_id: errorId,
        });
    }
    static handleInvalidTypeError(res) {
        const errorId = (0, uuid_1.v4)();
        logger_1.default.error(`Invalid Type Error [${errorId}]: Invalid measurement type`);
        return res.status(400).json({
            error_code: 'INVALID_TYPE',
            error_description: 'Tipo de medição inválido',
            error_id: errorId,
        });
    }
    static handleInvalidImageFormatError(res) {
        const errorId = (0, uuid_1.v4)();
        logger_1.default.error(`Invalid Image Format Error [${errorId}]: Image format is invalid`);
        return res.status(400).json({
            error_code: 'INVALID_IMAGE_FORMAT',
            error_description: 'Formato da imagem inválido',
            error_id: errorId,
        });
    }
    static handleApiError(res, message) {
        const errorId = (0, uuid_1.v4)();
        logger_1.default.error(`No Response Error [${errorId}]: No response from external API`);
        return res.status(500).json({
            error_code: 'API_ERROR',
            error_description: `Erro na API: ${message}`,
            error_id: errorId,
        });
    }
    static handleNoResponseError(res) {
        const errorId = (0, uuid_1.v4)();
        logger_1.default.error(`No Response Error [${errorId}]: No response from external API`);
        return res.status(500).json({
            error_code: 'NO_RESPONSE',
            error_description: 'Nenhuma resposta recebida da API',
            error_id: errorId,
        });
    }
    static handleCustomError(res, error) {
        const errorId = (0, uuid_1.v4)();
        if (error instanceof CustomError) {
            logger_1.default.error(`CustomError [${errorId}]: ${error.message}`, {
                code: error.code,
            });
            return res.status(error.statusCode).json({
                error_code: error.code,
                error_description: error.message,
                error_id: errorId,
            });
        }
        if (error instanceof Error) {
            logger_1.default.error(`Internal Error [${errorId}]: ${error.message}`);
            return res.status(500).json({
                error_code: 'INTERNAL_ERROR',
                error_description: 'An error occurred',
                error_message: error.message,
                error_id: errorId,
            });
        }
        logger_1.default.error(`Unknown Error [${errorId}]: Unknown error occurred`);
        return res.status(500).json({
            error_code: 'INTERNAL_ERROR',
            error_description: 'An error occurred',
            error_id: errorId,
        });
    }
    static handleUnexpectedError(res) {
        const errorId = (0, uuid_1.v4)();
        logger_1.default.error(`Unexpected Error [${errorId}]: An unexpected error occurred`);
        return res.status(500).json({
            error_code: 'INTERNAL_ERROR',
            error_description: 'An unexpected error occurred',
            error_id: errorId,
        });
    }
}
exports.ErrorHandler = ErrorHandler;
class CustomError extends Error {
    constructor(code, message, statusCode) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = 'CustomError';
    }
}
