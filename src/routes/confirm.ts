import express, { Request, Response } from 'express';
import { confirmMeasure } from '../services/measureService';
import { ErrorHandler } from '../validators/ErrorHandler';
import logger from '../validators/logger';

export const confirmRouter = express.Router();

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
confirmRouter.patch('/', async (req: Request, res: Response) => {
  try {
    await confirmMeasure(req, res);
  } catch (error: unknown) {
    logger.error(
      `Erro ao confirmar medida: ${
        error instanceof Error ? error.message : error
      }`,
    );
    if (error instanceof Error) {
      if (error.message === 'MEASURE_NOT_FOUND') {
        return ErrorHandler.handleNotFoundError(res, 'Leitura não encontrada');
      } else if (error.message === 'CONFIRMATION_DUPLICATE') {
        return ErrorHandler.handleConflictError(res, 'Leitura já confirmada');
      } else {
        return ErrorHandler.handleCustomError(res, error);
      }
    }
    return ErrorHandler.handleUnexpectedError(res);
  }
});
