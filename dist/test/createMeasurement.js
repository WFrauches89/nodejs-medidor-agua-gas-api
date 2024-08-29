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
const MeasurementRepository_1 = require("../repositories/MeasurementRepository");
const measurementRepo = new MeasurementRepository_1.MeasurementRepository();
const newMeasurement = {
    customer_code: 'ABC123',
    measure_uuid: 'some-uuid',
    measure_datetime: new Date(),
    measure_type: 'WATER',
    measure_value: 100,
    image_url: 'https://st4.depositphotos.com/3001967/26437/i/380/depositphotos_264375278-stock-photo-water-bill-lying-table-payment.jpg',
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const savedMeasurement = yield measurementRepo.createMeasurement(newMeasurement);
        console.log('Measurement saved:', savedMeasurement);
    }
    catch (error) {
        console.error('Error saving measurement:', error);
    }
}))();
