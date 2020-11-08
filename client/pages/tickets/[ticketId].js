import useRequest from "../../hooks/use-request";
import Router from "next/router";

const ShowTicket = ({ ticket }) => {

    const { doRequest , errors } = useRequest({
        url : "/api/orders",
        method : "post",
        body : {
            ticketId : ticket.id
        },
        onSuccess : (data) => Router.push(`/orders/${data.id}`)
    });

    const onPurchase = async (e) => {
        e.preventDefault();
        await doRequest();
    }

    return (
        <div>
            <h1>{ticket.title}</h1>
            <h4>Price : {ticket.price}</h4>
            { errors }
            <button onClick={() => doRequest()} className="btn btn-primary">Purchase</button>
        </div>
    );
}

ShowTicket.getInitialProps = async (context , client) => {
    const { ticketId } = context.query;
    const { data } = await client.get(`/api/tickets/${ticketId}`);
    return { ticket : data };
}

export default ShowTicket;