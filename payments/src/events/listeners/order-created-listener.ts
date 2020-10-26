import { Listener, OrderCreatedEvent, Subjects } from "@rampooticketing/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order"; 

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject : Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data : OrderCreatedEvent["data"] , msg : Message){
        
        const order = Order.build({
            id : data.id,
            version : data.version,
            status : data.status,
            price : data.ticket.price,
            userId : data.userId,
        });

        await order.save();

        msg.ack();
    }
}