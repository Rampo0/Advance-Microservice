import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { livenessReadinessRouter } from './routes/liveness-readiness';
import { errorHandler , NotFoundError} from '@rampooticketing/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed : false,
        secure : process.env.NODE_ENV !== "test"
    })
);

app.use(livenessReadinessRouter);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req , res) => { 
    throw new NotFoundError(); 
});

//midlewares
app.use(errorHandler);

export { app };