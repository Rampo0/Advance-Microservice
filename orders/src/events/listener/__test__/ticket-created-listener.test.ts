import { TicketCreatedEvent } from "@rampooticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";

const setup = async () => {

    const listener = new TicketCreatedListener(natsWrapper.client);

    const data : TicketCreatedEvent["data"] = {
        id : new mongoose.Types.ObjectId().toHexString(),
        version : 0,
        price : 20,
        title : "concert",
        userId : new mongoose.Types.ObjectId().toHexString(),
    }

    // @ts-ignore
    const msg : Message = {
        ack : jest.fn()
    };

    return { data, listener , msg};
}

it("ticket should be created when ticket created listener called", async () => {
    const { data, listener, msg } = await setup();

    await listener.onMessage(data, msg);

    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
})

it('acks the message', async () => {
    const { data, listener, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})