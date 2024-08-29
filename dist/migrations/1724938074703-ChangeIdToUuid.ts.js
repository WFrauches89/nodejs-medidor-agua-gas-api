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
exports.ChangeIdToUuid1724938074703 = void 0;
class ChangeIdToUuid1724938074703 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "measurement" ALTER COLUMN "id" SET DATA TYPE uuid USING uuid_generate_v4();`);
            yield queryRunner.query(`ALTER TABLE "measurement" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "measurement" ALTER COLUMN "id" SET DATA TYPE integer USING "id"::integer;`);
            yield queryRunner.query(`ALTER TABLE "measurement" ALTER COLUMN "id" DROP DEFAULT;`);
        });
    }
}
exports.ChangeIdToUuid1724938074703 = ChangeIdToUuid1724938074703;
