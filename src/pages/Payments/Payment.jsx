import React,{ useState, useEffect} from "react";
import logo from '../../../public/vite.svg'
import axios from "axios";
import tickets from '../../assets/tickets';

const Payment = () =>{
    const [ticketData,setTicketData] = useState({})
    const [sectedSeats,setSectedSeats] = useState({})

    useEffect(() =>{
        setTicketData(tickets)
    },[])

    async function displayRazorpay() {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        // creating a new order
        const result = await axios.post("http://localhost:5000/payment/orders");

        if (!result) {
            alert("Server error. Are you online?");
            return;
        }

        // Getting the order details back
        const { amount, id: order_id, currency } = result.data;

        console.log("Amount",amount)

        const options = {
            key: "rzp_test_T1hMVwg2u6p6uA", // Enter the Key ID generated from the Dashboard
            amount: amount.toString(),
            currency: currency,
            name: "ICC",
            description: "Test Transaction",
            image: { logo },
            order_id: order_id,
            handler: async function (response) {
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                };

                const result = await axios.post("http://localhost:5000/payment/success", data);

                alert(result.data.msg);
            },
            prefill: {
                name: "ICC Body",
                email: "enquiries@icc-cricket.com",
                contact: "+971-4-3828800",
            },
            notes: {
                address: "ICC Body",
            },
            theme: {
                color: "#61dafb",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
}

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
}
    return(
        <div className="container">
            {console.log(ticketData)}
            <header className="content">
                <div className="payment_details">
                    {tickets.map((ticket) =>(
                        <div>
                            <h1 className="ud">Payment Details</h1>
                            <div className="details">
                                <div className="payHeading">Mode of the match - <p>{ticket.name}</p></div>
                                <div className="payHeading">Total price - <p>{ticket.price}</p></div>
                                <div className="payHeading">Selected Seats - <p>{ticket.selected_seats}</p></div>
                                <div className="payHeading">Date of the match - <p>{ticket.date}</p></div>
                            </div>
                        </div>
                    )

                )}
                </div>
                <button className="ticketBook sze" onClick={displayRazorpay}>
                    Pay &#8377;1200
                </button>
            </header>
        </div>
    )
}

export default Payment;