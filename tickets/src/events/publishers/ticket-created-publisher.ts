import {Publisher, Subjects, TicketCreatedEvent} from '@rampooticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject : Subjects.TicketCreated = Subjects.TicketCreated;
}

