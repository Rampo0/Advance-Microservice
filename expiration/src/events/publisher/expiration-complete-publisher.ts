import { Publisher, ExpirationCompleteEvent, Subjects } from "@rampooticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject : Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}