import { Publisher , OrderCreatedEvent , Subjects} from "@rampooticketing/common"

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject : Subjects.OrderCreated = Subjects.OrderCreated;
}