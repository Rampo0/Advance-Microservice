import { Listener, OrderCreatedEvent, OrderCancelledEvent, OrderStatus, Subjects } from "@rampooticketing/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    queueGroupName = queueGroupName;
    subject : Subjects.OrderCreated = Subjects.OrderCreated;

    async onMessage( data : OrderCreatedEvent["data"] , msg : Message ){
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        
        await expirationQueue.add({
            orderId : data.id,
        }, 
        {
            delay,
        }
        );

        msg.ack();
    }
}