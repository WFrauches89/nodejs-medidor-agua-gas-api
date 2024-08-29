import express, { Request, Response } from 'express';
import { processImage } from '../services/imageService';
import { validationResult } from 'express-validator';
import { ErrorHandler } from '../validators/ErrorHandler';
import { uploadValidation } from '../validators/uploadValidator';
import { MeasureType } from '../models/measurement';
import logger from '../validators/logger';
import { GeminiApiError } from '../validators/geminiApiError';

export const uploadRouter = express.Router();

interface UploadRequestBody {
  image: string;
  customer_code: string;
  measure_datetime: string;
  measure_type: string;
}

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
uploadRouter.post(
  '/',
  uploadValidation,
  async (req: Request<{}, {}, UploadRequestBody>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ErrorHandler.handleValidationError(res, errors);
    }
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    const measureTypeEnum = measure_type.toUpperCase() as MeasureType;

    try {
      const result = await processImage(
        image,
        customer_code,
        measure_datetime,
        measureTypeEnum,
      );
      res.status(200).json(result);
    } catch (error: unknown) {
      if (error instanceof GeminiApiError) {
        logger.error(`Erro ao se comunicar com a API Gemini: ${error.message}`);
        ErrorHandler.handleApiError(
          res,
          'Erro ao se comunicar com a API Gemini',
        );
      } else {
        logger.error(
          `Erro no upload: ${error instanceof Error ? error.message : error}`,
        );
        ErrorHandler.handleCustomError(res, error);
      }
    }
  },
);
