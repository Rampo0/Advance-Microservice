import express, { Request , Response } from "express";
import { requireAuth, validateRequest, NotAuthorizedError , BadRequestError, NotFoundError, OrderStatus } from "@rampooticketing/common";
import { body } from "express-validator";
import { Order} from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const route = express.Router();

route.post("/api/payments", requireAuth, [
    body("token")
        .not()
        .isEmpty(),
    body("orderId")
        .not()
        .isEmpty()
] , validateRequest, async (req : Request , res : Response) => {
    
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if(!order){
        throw new NotFoundError();
    }

    if(req.currentUser!.id !== order.userId){
        throw new NotAuthorizedError();
    }

    if(order.status == OrderStatus.Cancelled){
        throw new BadRequestError("Cannot pay for cancelled order");
    }

    const charge = await stripe.charges.create({
        currency : "usd",
        amount : order.price * 100,
        source : token
    });

    const payment = Payment.build({
        orderId : order.id,
        stripeId : charge.id
    });

    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
        id : payment.id,
        orderId : payment.orderId,
        stripeId : payment.stripeId
    });
    
    res.status(201).send({ id : payment.id });
});

export { route as NewPaymentsRoute };