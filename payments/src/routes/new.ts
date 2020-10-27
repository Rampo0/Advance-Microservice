import express, { Request , Response } from "express";
import { requireAuth, validateRequest, NotAuthorizedError , BadRequestError, NotFoundError, OrderStatus } from "@rampooticketing/common";
import { body } from "express-validator";
import { Order} from "../models/order";

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
    
    res.send({ message : "success" });
});

export { route as NewPaymentsRoute };