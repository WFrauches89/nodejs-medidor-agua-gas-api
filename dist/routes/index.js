"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = require("./upload");
const confirm_1 = require("./confirm");
const list_1 = require("./list");
const router = express_1.default.Router();
router.use('/upload', upload_1.uploadRouter);
router.use('/confirm', confirm_1.confirmRouter);
router.use('/:customer_code/list', list_1.listRouter);
exports.default = router;
