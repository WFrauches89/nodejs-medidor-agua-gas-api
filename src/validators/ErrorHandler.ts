import { Response } from 'express';
import logger from './logger';
import { v4 as uuidv4 } from 'uuid';

export class ErrorHandler {
  static CustomError: any;
  static handleValidationError(res: Response, errors: any) {
    const errorId = uuidv4();
    logger.error(`Validation Error [${errorId}]: Invalid data in request`, {
      errors: errors.array(),
    });
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Dados inválidos no corpo da requisição.',
      error_id: errorId,
      errors: errors.array(),
    });
  }

  static handleNotFoundError(res: Response, message: string) {
    const errorId = uuidv4();
    logger.error(`Not Found [${errorId}]: ${message}`);
    return res.status(404).json({
      error_code: 'NOT_FOUND',
      error_description: message,
      error_id: errorId,
    });
  }

  static handleConflictError(res: Response, message: string) {
    const errorId = uuidv4();
    logger.error(`Conflict Error [${errorId}]: ${message}`);
    return res.status(409).json({
      error_code: 'CONFLICT',
      error_description: message,
      error_id: errorId,
    });
  }

  static handleInvalidTypeError(res: Response) {
    const errorId = uuidv4();
    logger.error(`Invalid Type Error [${errorId}]: Invalid measurement type`);
    return res.status(400).json({
      error_code: 'INVALID_TYPE',
      error_description: 'Tipo de medição inválido',
      error_id: errorId,
    });
  }

  static handleInvalidImageFormatError(res: Response) {
    const errorId = uuidv4();
    logger.error(
      `Invalid Image Format Error [${errorId}]: Image format is invalid`,
    );
    return res.status(400).json({
      error_code: 'INVALID_IMAGE_FORMAT',
      error_description: 'Formato da imagem inválido',
      error_id: errorId,
    });
  }

  static handleApiError(res: Response, message: string) {
    const errorId = uuidv4();
    logger.error(
      `No Response Error [${errorId}]: No response from external API`,
    );

    return res.status(500).json({
      error_code: 'API_ERROR',
      error_description: `Erro na API: ${message}`,
      error_id: errorId,
    });
  }

  static handleNoResponseError(res: Response) {
    const errorId = uuidv4();
    logger.error(
      `No Response Error [${errorId}]: No response from external API`,
    );
    return res.status(500).json({
      error_code: 'NO_RESPONSE',
      error_description: 'Nenhuma resposta recebida da API',
      error_id: errorId,
    });
  }

  static handleCustomError(res: Response, error: unknown) {
    const errorId = uuidv4();
    if (error instanceof CustomError) {
      logger.error(`CustomError [${errorId}]: ${error.message}`, {
        code: error.code,
      });
      return res.status(error.statusCode).json({
        error_code: error.code,
        error_description: error.message,
        error_id: errorId,
      });
    }
    if (error instanceof Error) {
      logger.error(`Internal Error [${errorId}]: ${error.message}`);
      return res.status(500).json({
        error_code: 'INTERNAL_ERROR',
        error_description: 'An error occurred',
        error_message: error.message,
        error_id: errorId,
      });
    }
    logger.error(`Unknown Error [${errorId}]: Unknown error occurred`);
    return res.status(500).json({
      error_code: 'INTERNAL_ERROR',
      error_description: 'An error occurred',
      error_id: errorId,
    });
  }

  static handleUnexpectedError(res: Response) {
    const errorId = uuidv4();
    logger.error(`Unexpected Error [${errorId}]: An unexpected error occurred`);
    return res.status(500).json({
      error_code: 'INTERNAL_ERROR',
      error_description: 'An unexpected error occurred',
      error_id: errorId,
    });
  }
}

class CustomError extends Error {
  public code: string;
  public statusCode: number;

  constructor(code: string, message: string, statusCode: number) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.name = 'CustomError';
  }
}
