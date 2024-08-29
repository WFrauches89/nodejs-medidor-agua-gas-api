"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMeasurementTable1724934715088 = void 0;
class CreateMeasurementTable1724934715088 {
    constructor() {
        this.name = 'CreateMeasurementTable1724934715088';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TYPE "public"."measurement_measure_type_enum" AS ENUM('WATER', 'GAS')`);
            yield queryRunner.query(`CREATE TABLE "measurement" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_code" character varying(100) NOT NULL, "measure_uuid" uuid NOT NULL, "measure_datetime" TIMESTAMP NOT NULL, "measure_type" "public"."measurement_measure_type_enum" NOT NULL, "measure_value" double precision NOT NULL, "confirmed_value" double precision, "image_url" character varying(255) NOT NULL, "has_confirmed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_742ff3cc0dcbbd34533a9071dfd" PRIMARY KEY ("id"))`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP TABLE "measurement"`);
            yield queryRunner.query(`DROP TYPE "public"."measurement_measure_type_enum"`);
        });
    }
}
exports.CreateMeasurementTable1724934715088 = CreateMeasurementTable1724934715088;
