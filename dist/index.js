"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const ErrorHandler_1 = require("./validators/ErrorHandler");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use('/api', routes_1.default);
// app.use('/upload', uploadRouter);
// app.use('/confirm', confirmRouter);
// app.use('/:customer_code/list', listRouter);
app.use((err, req, res, next) => {
    if (err) {
        return ErrorHandler_1.ErrorHandler.handleCustomError(res, err);
    }
    next();
});
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});
