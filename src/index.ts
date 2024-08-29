import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import 'reflect-metadata';
import dotenv from 'dotenv';
import { ErrorHandler } from './validators/ErrorHandler';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import router from './routes';

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use('/api', router);

// app.use('/upload', uploadRouter);
// app.use('/confirm', confirmRouter);
// app.use('/:customer_code/list', listRouter);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    return ErrorHandler.handleCustomError(res, err);
  }
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
});
