import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeIdToUuid1724938074703 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "measurement" ALTER COLUMN "id" SET DATA TYPE uuid USING uuid_generate_v4();`,
    );

    await queryRunner.query(
      `ALTER TABLE "measurement" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "measurement" ALTER COLUMN "id" SET DATA TYPE integer USING "id"::integer;`,
    );

    await queryRunner.query(
      `ALTER TABLE "measurement" ALTER COLUMN "id" DROP DEFAULT;`,
    );
  }
}
