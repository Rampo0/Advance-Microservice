import mongoose from "mongoose";
import { OrderStatus } from "@rampooticketing/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
    id : string,
    version : number,
    status : OrderStatus,
    price : number,
    userId : string
}

interface OrderDoc extends mongoose.Document {
    version : number,
    status : OrderStatus,
    price : number,
    userId : string
}

interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attrs : OrderAttrs) : OrderDoc
    findByEvent(event : { id : string , version : number }) : Promise<OrderDoc | null>;
}

const orderSchema = new mongoose.Schema({
    status : {
        type : String,
        required : true,
        enum : Object.values(OrderStatus),
    },
    price : {
        type : Number,
        required : true,
    },
    userId : {
        type : String,
        required : true,
    },
}, {
    toJSON : {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs : OrderAttrs) => {
    return new Order({
        _id : attrs.id,
        version : attrs.version,
        status : attrs.status,
        userId  : attrs.userId,
        price : attrs.price
    });
}

orderSchema.statics.findByEvent = (event : {id : string, version : number}) => {
    return Order.findOne({
        _id : event.id,
        version : event.version - 1
    });
}

const Order = mongoose.model<OrderDoc, OrderModel>("Order" , orderSchema);

export { Order };