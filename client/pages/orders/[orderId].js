import { useState , useEffect } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderPage = ({ currentUser, order }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const { doRequest , errors } = useRequest({
        url : "/api/payments",
        method : "post",
        body : {
            orderId : order.id,
        },
        onSuccess : (data) => Router.push("/orders")
    });

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    const onToken = async ({ id }) => {
        // console.log(token);
        await doRequest({ token : id});
    }

    if(timeLeft <= 0){
        return (
            <div>
                Order Expired
            </div>
        )
    }

    return (
        <div>
           <div>Time left to pay: {timeLeft} seconds</div><br></br>
           {errors}
            <StripeCheckout 
                token={onToken}
                stripeKey="pk_test_3XHvKm6tRChw68LdAdd5YWcr000OENDq0d"
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
            
        </div>
    )
}

OrderPage.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order : data };
}

export default OrderPage;