import buildClient from '../api/build-client';
import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {

    const ticketList = tickets.map(ticket => {
        return (
            <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                    <Link href="/tickets/[ticketId]"  as={`/tickets/${ticket.id}`}>
                        <a>View</a>
                    </Link>
                </td>
            </tr>
        )
    })

    return (
    <div>
        <h1>Ticket List</h1>
        <table className="table">
            <thead>
                <tr>
                    <th>Title</th>    
                    <th>Price</th>
                    <th>View</th>
                </tr>
            </thead>
            <tbody>
                {ticketList}
            </tbody>
        </table>

    </div>)

    // return currentUser ? <h1>You are sign in</h1> : <h1>Your are not sign in</h1>
};

LandingPage.getInitialProps = async (context, client , currentUser ) => {
    
    const { data } = await client.get("/api/tickets");
    return { tickets : data }
    
};

export default LandingPage;