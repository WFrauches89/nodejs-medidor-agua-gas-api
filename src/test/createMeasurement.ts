import { MeasurementRepository } from '../repositories/MeasurementRepository';

const measurementRepo = new MeasurementRepository();

const newMeasurement: {
  customer_code: string;
  measure_uuid: string;
  measure_datetime: Date;
  measure_type: 'WATER' | 'GAS';
  measure_value: number;
  image_url: string;
} = {
  customer_code: 'ABC123',
  measure_uuid: 'some-uuid',
  measure_datetime: new Date(),
  measure_type: 'WATER',
  measure_value: 100,
  image_url:
    'https://st4.depositphotos.com/3001967/26437/i/380/depositphotos_264375278-stock-photo-water-bill-lying-table-payment.jpg',
};

(async () => {
  try {
    const savedMeasurement = await measurementRepo.createMeasurement(
      newMeasurement,
    );
    console.log('Measurement saved:', savedMeasurement);
  } catch (error) {
    console.error('Error saving measurement:', error);
  }
})();
