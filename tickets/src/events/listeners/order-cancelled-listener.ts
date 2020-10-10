import { Listener, OrderCancelledEvent } from "@rampooticketing/common";
import { queueGroupName } from "./queue-group-name";
import { Subjects } from "@rampooticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject : Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data : OrderCancelledEvent["data"], msg : Message){
        const ticket = await Ticket.findById(data.ticket.id);

        if(!ticket){
            throw new Error("ticket not found");
        }

        ticket.set({ orderId : undefined });
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id : ticket.id,
            title : ticket.title,
            price : ticket.price,
            userId : ticket.userId,
            version : ticket.version,
            orderId : ticket.orderId,
        });

        msg.ack();
    }
}