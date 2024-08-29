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
exports.MeasurementRepository = void 0;
const ormconfig_1 = require("../ormconfig");
const measurement_1 = require("../models/measurement");
const typeorm_1 = require("typeorm"); // Para verificar leituras dentro de um intervalo de tempo
class MeasurementRepository {
    constructor() {
        this.repository = ormconfig_1.AppDataSource.getRepository(measurement_1.Measurement);
    }
    createMeasurement(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const measurement = this.repository.create(data);
            return yield this.repository.save(measurement);
        });
    }
    existsReading(customer_code, measure_type, measure_datetime) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedDate = new Date(measure_datetime);
            const startOfMonth = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1);
            const endOfMonth = new Date(parsedDate.getFullYear(), parsedDate.getMonth() + 1, 0);
            const existingMeasurement = yield this.repository.findOne({
                where: {
                    customer_code,
                    measure_type,
                    measure_datetime: (0, typeorm_1.Between)(startOfMonth, endOfMonth),
                },
            });
            return !!existingMeasurement;
        });
    }
    getMeasurements(customer_code, measure_datetime, measure_type) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedDate = new Date(measure_datetime);
            const whereConditions = {
                customer_code,
                measure_datetime: parsedDate,
            };
            if (measure_type) {
                whereConditions.measure_type = measure_type.toUpperCase(); // Garantir case insensitive
            }
            return this.repository.find({ where: whereConditions });
        });
    }
    findByUUID(measure_uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findOne({
                where: { measure_uuid },
            });
        });
    }
    saveMeasurement(measurement) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.save(measurement);
        });
    }
}
exports.MeasurementRepository = MeasurementRepository;
