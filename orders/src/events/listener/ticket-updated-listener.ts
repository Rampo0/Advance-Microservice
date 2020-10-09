import { Listener, Subjects, TicketUpdatedEvent } from "@rampooticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    queueGroupName = queueGroupName;
    subject : Subjects.TicketUpdated = Subjects.TicketUpdated;

    async onMessage( data : TicketUpdatedEvent['data'], msg : Message ){
        const ticket = await Ticket.findOne({
            _id : data.id,
            version : data.version - 1,
        });

        if(!ticket){
            throw new Error("Not found error");
        }

        const { price, title } = data;
        ticket.set({
            title,
            price,
        });

        await ticket.save()

        msg.ack();
    }
}