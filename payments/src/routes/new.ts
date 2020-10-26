import express, { Request , Response } from "express";
import { requireAuth, validateRequest, BadRequestError, NotFoundError } from "@rampooticketing/common";
import { body } from "express-validator";


const route = express.Router();

route.post("/api/payments", requireAuth, [
    body("token")
        .not()
        .isEmpty(),
    body("orderId")
        .not()
        .isEmpty()
] , validateRequest, async (req : Request , res : Response) => {
    res.send({ message : "success" });
});

export { route as NewPaymentsRoute };