import {Publisher, Subjects, TicketUpdatedEvent} from '@rampooticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject : Subjects.TicketUpdated = Subjects.TicketUpdated;
}

