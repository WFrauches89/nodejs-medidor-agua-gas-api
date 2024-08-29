import { Entity, Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

export enum MeasureType {
  WATER = 'WATER',
  GAS = 'GAS',
}

@Entity()
export class Measurement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  customer_code!: string;

  @Column({ type: 'uuid' })
  measure_uuid!: string;

  @Column({ type: 'timestamp' })
  measure_datetime!: Date;

  @Column({ type: 'enum', enum: ['WATER', 'GAS'] })
  measure_type!: 'WATER' | 'GAS';

  @Column({ type: 'float' })
  measure_value!: number;

  @Column({ type: 'float', nullable: true })
  confirmed_value!: number;

  @Column({ type: 'varchar', length: 255 })
  image_url!: string;

  @Column({ type: 'boolean', default: false })
  has_confirmed!: boolean;
}
