import React, { useState, useEffect, useReducer } from 'react';
import { Redirect, Link } from 'react-router-dom';
import useLocalStorage from '../Functions/useLocalStore';
import { CardElement, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
//import {injectStripe} from 'react-stripe-elements';
import checkIfExist from '../Functions/checkIfExist';
import { connect } from 'react-redux';


const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: "#32325d",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#aab7c4",
            },
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
        },
    },
};

async function stripeTokenHandler(token, userID, user, firstname, lastname, basket, orderID, totalCart) {
    const paymentData = { token: token.id, userID: userID, user: user, firstname: firstname, lastname: lastname, basket: basket, orderID: orderID, totalCart: totalCart };

    // Use fetch to send the token ID and any other payment data to your server.
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    let url = '/api/charge';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('retour back', data.status)
            if (data.status) {

                return (true)
            } else {
                return (false);
            }
        }).catch((data) => {
            console.log("error == ", data)
        });

    return response
    // Return and display the result of the charge.
}


const CheckoutForm = (props) => {
    const stripe = useStripe();
    const elements = useElements();
    const [userID, setuserID] = useLocalStorage('user', '');
    const [guestID, setguestID] = useLocalStorage('guest', '');
    const [cardElement, setcardElement] = useState({
        firstname: '',
        lastname: '',
        orderID: '',
        basket: [],
        totalCart: 0
    })

    const [address, setaddress] = useState('');


    useEffect(() => {
        console.log("je recois quoi de mon element payment ? ?? ", props.user, props.basket, props.orderID, props.totalCart);

        setcardElement({ firstname: props.user.firstname, lastname: props.user.lastname, basket: props.basket, orderID: props.orderID, totalCart: props.totalCart })
        // const fetchData = async () => {
        //     let url = 'http://localhost:5000/getuser';
        //     fetch(url, {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        //         body: `id=${userID}`
        //     })
        //         .then((response) => response.json())
        //         .then((data) => {
        //             console.log('retour du back === ', data)
        //             setuser({
        //                 orders: data.user.orders,
        //                 lastname: data.user.lastname,
        //             })
        //         })
        // }
        // fetchData();

    }, []);


    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make  sure to disable form submission until Stripe.js has loaded.
            return;
        }
        //console.log('test', elements.getElement(CardElement))
        const card = elements.getElement(CardElement);
        //const card = elements.getElement({ cardnumber: CardNumberElement, cardExpiry: CardExpiryElement, cardCVC: CardCvcElement });
        const result = await stripe.createToken(card);

        if (result.error) {
            // Show error to your customer.
            console.log('error stripe', result.error.message);
            //CREER UN MESSAGE DERREUR
        } else {
            // Send the token to your server.
            // This function does not exist yet; we will define it in the next step.
            let retourBack = await stripeTokenHandler(result.token, (checkIfExist(userID) ? userID : guestID), props.user, cardElement.firstname, cardElement.lastname, cardElement.basket, cardElement.orderID, cardElement.totalCart);
            // je controle la réussite du paiement 
            console.log('retour back', retourBack)
            if (retourBack) {
                console.log('merci panier validé!')
                const updateData = async () => {
                    await window.localStorage.removeItem('order');
                    await window.localStorage.removeItem('count');
                    await window.localStorage.removeItem('guest');
                    await props.newCount(0);
                    await props.newBasket([]);
                    await props.newOrder('');
                }
                updateData();
                props.setPaymentValid(true);
            } else {
                //CREER UN MESSAGE DERREUR
                console.log('ooops erreur!')
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h4>Proceed to Payment</h4>
            <div className='subPaymentName'>

                <div className='subPayment'>
                    <label>First Name</label>
                    <input type='text' name='firstname' value={cardElement.firstname} required
                        onChange={(e) => setcardElement({ ...cardElement, firstname: e.target.value })}></input>
                    <h6>As it appears on your card.</h6>
                </div>
                <div className='subPayment'>
                    <label>Last Name</label>
                    <input type='text' name='lastname' value={cardElement.lastname} required
                        onChange={(e) => setcardElement({ ...cardElement, lastname: e.target.value })}></input>
                    <h6>As it appears on your card.</h6>
                </div>

            </div>
            <label>
                Card details</label>

            <div className='subPaymentINFO'>
                <CardElement className="input" options={CARD_ELEMENT_OPTIONS} />
                <div className="subCardInfo">
                    <h6>Card number</h6>
                    <h6>Enter the expiration date on your card</h6>
                    <h6>Security Code printed on your card, 3-4 digits.</h6>
                </div>
                {/* <label>Card Number</label>
                <CardNumberElement className="input" />
                Collects the card number.
                <label> Expiry Date</label >
                <CardExpiryElement />
                Collects the card‘s expiration date.
                < label > CVC</label >
                <CardCvcElement /> */}
            </div>


            {/* <CardSection /> */}
            <div>



            </div>
            {/* <button disabled={!stripe}>Confirm order</button> */}
            < button className='button log' type="submit" disabled={!stripe}>
                Process to Payment
            </button >
        </form>
    );
};


function mapDispatchToProps(dispatch) {
    return {
        // newUser: function (userToSend) {
        //     console.log('je suis dans le NEW USER REDUCER', userToSend)
        //     dispatch({ type: 'setUser', user: userToSend })
        // },
        newCount: function (countToSend) {
            console.log('je suis dans le NEW COUNT REDUCER', countToSend)
            dispatch({ type: 'setCount', count: countToSend })
        },
        newBasket: function (basketToSend) {
            console.log('je suis dans le NEW BASKET REDUCERS', basketToSend)
            dispatch({ type: 'updateBasket', basket: basketToSend })
        },
        newOrder: function (orderToSend) {
            console.log('je suis dans le NEW ORDER REDUCER', orderToSend)
            dispatch({ type: 'setOrder', order: orderToSend })
        }
    }
};

export default connect(null, mapDispatchToProps)(CheckoutForm);

//export default CheckoutForm;