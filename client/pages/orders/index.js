const OrderList = ({ orders }) => {
    return (<div>
        <h1>My Orders List</h1>
        <ul>
            {orders.map((order) => {
                return <li>{order.ticket.title} - {order.status}</li>
            })}
        </ul>
    </div>)
}

OrderList.getInitialProps = async (context, client) => {
    const { data } = await client.get("/api/orders");
    return { orders : data }
}

export default OrderList;