"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Measurement = exports.MeasureType = void 0;
const typeorm_1 = require("typeorm");
const typeorm_2 = require("typeorm");
var MeasureType;
(function (MeasureType) {
    MeasureType["WATER"] = "WATER";
    MeasureType["GAS"] = "GAS";
})(MeasureType || (exports.MeasureType = MeasureType = {}));
let Measurement = class Measurement {
};
exports.Measurement = Measurement;
__decorate([
    (0, typeorm_2.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Measurement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Measurement.prototype, "customer_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Measurement.prototype, "measure_uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Measurement.prototype, "measure_datetime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['WATER', 'GAS'] }),
    __metadata("design:type", String)
], Measurement.prototype, "measure_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], Measurement.prototype, "measure_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], Measurement.prototype, "confirmed_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Measurement.prototype, "image_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Measurement.prototype, "has_confirmed", void 0);
exports.Measurement = Measurement = __decorate([
    (0, typeorm_1.Entity)()
], Measurement);
