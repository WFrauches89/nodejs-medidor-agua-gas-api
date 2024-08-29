import { Response, Request } from 'express';
import { MeasurementRepository } from '../repositories/MeasurementRepository';
import { Measurement, MeasureType } from '../models/measurement';
import { ErrorHandler } from '../validators/ErrorHandler';

const measurementRepository = new MeasurementRepository();

export async function confirmMeasure(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { measure_uuid, confirmed_value } = req.body;

    if (!measure_uuid || !confirmed_value) {
      return ErrorHandler.handleValidationError(res, {
        array: () => [
          { param: 'measure_uuid', msg: 'UUID da medição é necessário' },
          { param: 'confirmed_value', msg: 'Valor confirmado é necessário' },
        ],
      });
    }
    const measurement: Measurement | null =
      await measurementRepository.findByUUID(measure_uuid);

    if (!measurement) {
      return ErrorHandler.handleNotFoundError(res, 'Measurement not found');
    }

    if (measurement.has_confirmed) {
      return ErrorHandler.handleConflictError(
        res,
        'Measurement already confirmed',
      );
    }

    measurement.confirmed_value = confirmed_value;
    measurement.has_confirmed = true;

    await measurementRepository.saveMeasurement(measurement);

    return res.status(200).json({
      message: 'Measurement confirmed successfully',
    });
  } catch (error) {
    return ErrorHandler.handleCustomError(res, error);
  }
}

interface QueryParams {
  customer_code?: string;
  measure_type?: string | string[];
}

export async function getMeasures(
  req: Request<{}, {}, {}, QueryParams>,
  res: Response,
): Promise<Response> {
  const { customer_code, measure_type } = req.query;

  if (!customer_code || typeof customer_code !== 'string') {
    return ErrorHandler.handleValidationError(res, {
      array: () => [
        {
          param: 'customer_code',
          msg: 'Código do cliente é necessário',
        },
      ],
    });
  }

  let measureTypeEnum: MeasureType | undefined;

  if (measure_type) {
    const measureTypeValue = Array.isArray(measure_type)
      ? measure_type[0]
      : measure_type;

    if (typeof measureTypeValue === 'string') {
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
    } else {
      return ErrorHandler.handleValidationError(res, {
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
    const measurements = await measurementRepository.getMeasurements(
      customer_code,
      new Date().toISOString(),
      measureTypeEnum,
    );

    return res.status(200).json(measurements);
  } catch (error) {
    return ErrorHandler.handleCustomError(res, error);
  }
}
