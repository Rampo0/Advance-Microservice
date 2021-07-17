import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { json } from 'body-parser';
import { errorHandler , NotFoundError, currentUser } from '@rampooticketing/common'
import { indexOrderRouter } from './routes/index';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { deleteOrderRouter } from './routes/delete';
import { metricsRouter } from './routes/metrics';
import swStats from 'swagger-stats';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed : false,
        secure : process.env.NODE_ENV !== "test"
    })
);
app.use(swStats.getMiddleware({}));
app.use(currentUser);

app.use(metricsRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);

app.all('*', async (req , res) => { 
    throw new NotFoundError(); 
});

//midlewares
app.use(errorHandler);

export { app };