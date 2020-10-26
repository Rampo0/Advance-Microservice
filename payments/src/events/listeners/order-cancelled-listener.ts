import { Subjects, Listener , OrderCancelledEvent } from "@rampooticketing/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { OrderStatus } from "@rampooticketing/common";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject : Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage( data : OrderCancelledEvent["data"] , msg : Message ){
        const order = await Order.findByEvent({
            id : data.id,
            version : data.version
        });

        if(!order){
            throw new Error("Order not found");
        }

        order.set({
            status : OrderStatus.Cancelled
        });

        await order.save();
        
        msg.ack();
    }   
}