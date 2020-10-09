import { Ticket } from "../ticket";

it("implement optimistic concurrency control", async (done) => {

    const newTicket = Ticket.build({
        title : "concert",
        price : 20,
        userId : "abcdfg"
    });

    await newTicket.save();

    const instanceOne = await Ticket.findById(newTicket.id);
    const instanceTwo = await Ticket.findById(newTicket.id);

    instanceOne?.set({ price : 10 });
    instanceTwo?.set({ price : 15 });

    await instanceOne?.save();
    
    try{
        await instanceTwo?.save();
    }catch(err){
        return done();
    }

    throw new Error("Should not reach this point");
    
});

it("increment version on multiple saves", async () => { 
    const ticket = Ticket.build({
        title : "concert",
        price : 20,
        userId : "abcdfg"
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
    
});