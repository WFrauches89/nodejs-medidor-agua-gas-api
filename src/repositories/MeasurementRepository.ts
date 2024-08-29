import { AppDataSource } from '../ormconfig';
import { Measurement, MeasureType } from '../models/measurement';
import { Repository } from 'typeorm';
import { Between } from 'typeorm'; // Para verificar leituras dentro de um intervalo de tempo

export class MeasurementRepository {
  private repository: Repository<Measurement>;

  constructor() {
    this.repository = AppDataSource.getRepository(Measurement);
  }

  async createMeasurement(data: Partial<Measurement>): Promise<Measurement> {
    const measurement = this.repository.create(data);
    return await this.repository.save(measurement);
  }

  async existsReading(
    customer_code: string,
    measure_type: MeasureType,
    measure_datetime: string,
  ): Promise<boolean> {
    const parsedDate = new Date(measure_datetime);

    const startOfMonth = new Date(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      parsedDate.getFullYear(),
      parsedDate.getMonth() + 1,
      0,
    );

    const existingMeasurement = await this.repository.findOne({
      where: {
        customer_code,
        measure_type,
        measure_datetime: Between(startOfMonth, endOfMonth),
      },
    });

    return !!existingMeasurement;
  }

  async getMeasurements(
    customer_code: string,
    measure_datetime: string,
    measure_type?: MeasureType,
  ): Promise<Measurement[]> {
    const parsedDate = new Date(measure_datetime);
    const whereConditions: any = {
      customer_code,
      measure_datetime: parsedDate,
    };

    if (measure_type) {
      whereConditions.measure_type = measure_type.toUpperCase(); // Garantir case insensitive
    }

    return this.repository.find({ where: whereConditions });
  }

  async findByUUID(measure_uuid: string): Promise<Measurement | null> {
    return this.repository.findOne({
      where: { measure_uuid },
    });
  }

  async saveMeasurement(measurement: Measurement): Promise<Measurement> {
    return this.repository.save(measurement);
  }
}
