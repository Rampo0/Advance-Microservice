
import { Subjects , PaymentCreatedEvent, Publisher } from "@rampooticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject : Subjects.PaymentCreated = Subjects.PaymentCreated;
}