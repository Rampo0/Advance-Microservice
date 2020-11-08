import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const NewTicket = ({ currentUser }) => {

    const [ title, setTitle ] = useState("");
    const [ price, setPrice ] = useState("");
    const { doRequest , errors } = useRequest({
        url : "/api/tickets",
        method : "post",
        body : { title,  price },
        onSuccess : (ticket) => Router.push("/") 
    });

    const onBlur = () => {
        const value = parseFloat(price);

        if(isNaN(value)){
            return;
        }

        setPrice(value.toFixed(2));
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        await doRequest();
    }

    return <div>
        <h1>New ticket</h1>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" type="text"></input>
            </div>
            <div className="form-group">
                <label>price</label>
                <input onBlur={onBlur} value={price} onChange={(e) => setPrice(e.target.value)} className="form-control" type="text"></input>
            </div>
            <button className="btn btn-primary">submit</button>
        </form>
        {errors}
    </div>
}  

export default NewTicket;