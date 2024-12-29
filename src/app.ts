import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import NotFound from './app/middleware/notFound';

const app: Application = express();

//parsers
app.use(cors());
app.use(express.json());
// app.use(express.json(), (req, res, next) => {
//   console.log('Request Body After Parsing:', req.body); // Check after parsing
//   next();
// });

//  Application Routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

//  Global Error Handler
app.use(globalErrorHandler);

// Not Found Route
app.use(NotFound);

export default app;
