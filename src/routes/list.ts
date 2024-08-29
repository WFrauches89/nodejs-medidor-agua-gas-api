import express, { Request, Response } from 'express';
import { getMeasures } from '../services/measureService';
import { ErrorHandler } from '../validators/ErrorHandler';
import { MeasureType } from '../models/measurement'; // Importa o tipo MeasureType

export const listRouter = express.Router();

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
listRouter.get('/', async (req: Request, res: Response) => {
  const { measure_type } = req.query as { measure_type?: string | string[] };
  const customer_code = req.query.customer_code as string | undefined;

  let measureTypeEnum: MeasureType | undefined;

  if (measure_type) {
    const measureTypeValue = Array.isArray(measure_type)
      ? measure_type[0]
      : measure_type;
    const upperCaseMeasureType = measureTypeValue.toUpperCase();

    if (['WATER', 'GAS'].includes(upperCaseMeasureType)) {
      measureTypeEnum = upperCaseMeasureType as MeasureType;
    } else {
      return ErrorHandler.handleValidationError(res, {
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
    return ErrorHandler.handleValidationError(res, {
      array: () => [
        {
          param: 'customer_code',
          msg: 'Código do cliente é necessário',
        },
      ],
    });
  }

  try {
    const measures = await getMeasures(req, res);

    if (!Array.isArray(measures)) {
      throw new Error('Resposta inválida do getMeasures');
    }

    if (measures.length === 0) {
      return ErrorHandler.handleNotFoundError(
        res,
        'Nenhuma leitura encontrada',
      );
    } else {
      return res.status(200).json({ customer_code, measures });
    }
  } catch (error: unknown) {
    return ErrorHandler.handleCustomError(res, error);
  }
});
