import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMeasurementTable1724934715088 implements MigrationInterface {
    name = 'CreateMeasurementTable1724934715088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."measurement_measure_type_enum" AS ENUM('WATER', 'GAS')`);
        await queryRunner.query(`CREATE TABLE "measurement" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_code" character varying(100) NOT NULL, "measure_uuid" uuid NOT NULL, "measure_datetime" TIMESTAMP NOT NULL, "measure_type" "public"."measurement_measure_type_enum" NOT NULL, "measure_value" double precision NOT NULL, "confirmed_value" double precision, "image_url" character varying(255) NOT NULL, "has_confirmed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_742ff3cc0dcbbd34533a9071dfd" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "measurement"`);
        await queryRunner.query(`DROP TYPE "public"."measurement_measure_type_enum"`);
    }

}
