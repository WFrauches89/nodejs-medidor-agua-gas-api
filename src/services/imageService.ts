import axios, { AxiosError } from 'axios';
import { MeasurementRepository } from '../repositories/MeasurementRepository';
import { MeasureType } from '../models/measurement';
import isBase64 from 'is-base64';
import { ErrorHandler } from '../validators/ErrorHandler';

const API_KEY = process.env.API_KEY || '';
const measurementRepository = new MeasurementRepository();

export const processImage = async (
  image: string,
  customer_code: string,
  measure_datetime: string,
  measure_type: MeasureType,
) => {
  if (measure_type !== 'WATER' && measure_type !== 'GAS') {
    throw new ErrorHandler.CustomError(
      'INVALID_TYPE',
      'Tipo de medição não permitido',
      400,
    );
  }
  if (!isBase64(image, { mimeRequired: true })) {
    throw new ErrorHandler.CustomError(
      'INVALID_IMAGE_FORMAT',
      'Formato de imagem inválido',
      400,
    );
  }

  try {
    const readingExists = await measurementRepository.existsReading(
      customer_code,
      measure_type,
      measure_datetime,
    );

    if (readingExists) {
      throw new ErrorHandler.CustomError(
        'DOUBLE_REPORT',
        'Leitura duplicada',
        409,
      );
    }

    const response = await axios.post(
      'https://api.gemini.example.com/process',
      { image },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      },
    );

    const { image_url, measure_uuid, measure_value } = response.data;

    return {
      image_url,
      measure_value,
      measure_uuid,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const responseData = error.response.data;
        const message =
          typeof responseData === 'object' &&
          responseData !== null &&
          'message' in responseData
            ? (responseData as { message: string }).message
            : 'Unknown API error';
        throw new ErrorHandler.CustomError(
          'API_ERROR',
          `Erro da API: ${message}`,
          500,
        );
      } else if (error.request) {
        throw new ErrorHandler.CustomError(
          'NO_RESPONSE',
          'Nenhuma resposta recebida da API',
          500,
        );
      } else {
        throw new ErrorHandler.CustomError(
          'REQUEST_ERROR',
          `Erro na requisição: ${error.message}`,
          500,
        );
      }
    } else {
      throw new ErrorHandler.CustomError(
        'INTERNAL_ERROR',
        `Erro interno: ${(error as Error).message}`,
        500,
      );
    }
  }
};
