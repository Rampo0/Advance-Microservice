import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { json } from 'body-parser';
import { errorHandler , NotFoundError, currentUser } from '@rampooticketing/common'
import { NewPaymentsRoute } from "./routes/new";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed : false,
        secure : process.env.NODE_ENV !== "test"
    })
);
app.use(currentUser);

app.use(NewPaymentsRoute);

app.all('*', async (req , res) => { 
    throw new NotFoundError(); 
});

//midlewares
app.use(errorHandler);

export { app };