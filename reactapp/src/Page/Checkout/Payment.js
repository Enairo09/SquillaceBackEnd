
import React, { useState, useEffect, useReducer } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import auMillieme from '../../Functions/roundNum';
import useLocalStorage from '../../Functions/useLocalStore';

import MyCheckoutForm from '../../Components/MyCheckoutForm';
import { Elements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutShipForm from '../../Components/CheckoutShipForm';
import headCount from '../../Functions/headCount';
import checkIfExist from '../../Functions/checkIfExist';

function mapStateToProps(state) {
    console.log('payment get user', state.user)
    return { user: state.user, prodList: state.basket }
};

const stripePromise = loadStripe('pk_test_gVPvQdtolFZzYQmPVqUw324Z00y8aGU5CX');

const Payment = (props) => {
    const [finalBasket, setfinalBasket] = useState([]);
    const [userID, setuserID] = useLocalStorage('user', '');
    const [guestID, setguestID] = useLocalStorage('guest', '');
    const [orderID, setorderID] = useLocalStorage('order', '');
    const [user, setuser] = useState()
    // const [user, setuser] = useState({
    //     firstname: '',
    //     lastname: '',
    //     address: '',
    //     optional: '',
    //     zipcode: '',
    //     state: '',
    //     city: '',
    //     newsletter: '',
    //     email: '',
    //     gender: '',
    //     phone: '',
    //     compagnyname: '',
    //     billingaddress: '',
    //     billingoptional: '',
    //     billingzipcode: '',
    //     billingcity: '',
    //     billingstate: '',
    //     // password: '',
    //     // token: String,
    //     // salt: String,
    //     statut: '',
    //     inscription: '',
    //     birthday: '',
    //     orders: []
    // });
    // const [card, setcard] = useState({
    //     card
    // })
    const [showPayment, setshowPayment] = useState(false);
    const [payValid, setpayValid] = useState(false);
    const [totalCart, settotalCart] = useState(0);
    const [totalProdQty, settotalProdQty] = useState(0);
    //const [name, setName] = useState("i'm Grand Parent");
    //je recupere mon produit
    useEffect(() => {
        const fetchData = async () => {

            let url = '/api/getuserandcart';
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `userID=${(checkIfExist(userID) ? userID : guestID)}&orderID=${orderID}`
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('retour du back payment page ==', data)
                    //setuser(user)
                    setuser(data.user)
                    //     optional: data.user.optional,
                    //     zipcode: data.user.zipcode,
                    //     city: data.user.city,
                    //     state: data.user.state,
                    //     newsletter: data.user.newsletter,
                    //     email: data.user.email,
                    //     gender: data.user.gender,
                    //     phone: data.user.phone,
                    //     compagnyname: data.user.compagnyname,
                    //     billingname: data.user.billingname,
                    //     billingaddress: data.user.billingaddress,
                    //     billingoptional: data.user.billingoptional,
                    //     billingzipcode: data.user.billingzipcode,
                    //     billingcity: data.user.billingcity,
                    //     billingstate: data.user.billingstate,
                    //     // password: '',
                    //     // token: String,
                    //     // salt: String,
                    //     statut: data.user.statut,
                    //     inscription: data.user.inscription,
                    //     birthday: data.user.birthday,
                    //     orders: data.user.orders
                    // })
                    setfinalBasket(data.basket);
                    console.log('je verifie que je recupere le bon panier: et compte', data, checkIfExist(data.user.address))
                    settotalCart(auMillieme(data.totalCart));
                    settotalProdQty(headCount(data.basket));
                    if (checkIfExist(data.user.address)) {
                        setshowPayment(true);
                    } else {
                        setshowPayment(false);
                    }
                });
        }
        fetchData();

    }, []);

    var prodList = finalBasket.map((product, i) => {

        return (
            <div className='productCart' key={i}>
                <div className='payDetailL'>
                    <img
                        className="payPic"
                        src={product.img} />
                    <h5 className='payProdName'
                    >{product.name}</h5>
                </div>
                <h6 className='payDetailR'>{product.price}€</h6>
                {/* <div className='productsDetailCart' style={{ display: 'flex', flexDirection: 'column' }}> */}
                {/* <div className="sizeCart" style={{ display: 'flex' }}>
                        <h5 className="sizeDetail">Size :</h5>
                        <h5  >{product.size} </h5>

                    </div> */}
                {/* <div className='quantityCart' > */}
                {/* <h5 className="quantityDetail">Quantity : </h5> */}

                {/* <h5 >{product.quantity}</h5> */}
                {/* </div> */}
                {/* </div> */}
            </div>
        )

    });
    if (!payValid) {
        return (
            <div className="payBloc content">
                <Elements stripe={stripePromise}>
                    <div className="payment">
                        <CheckoutShipForm setnewUser={setuser} setValidShowPayment={setshowPayment} />
                        {showPayment ? <MyCheckoutForm user={user} basket={finalBasket} orderID={orderID} totalCart={totalCart} setPaymentValid={setpayValid} /> :
                            null
                        }
                    </div>
                </Elements>
                <div className="paymentCart" style={{ display: 'flex', justifyContent: 'space-around' }}>
                    {prodList}
                    <h5 className="h5marg">Your Order
                ({totalProdQty} items)
                </h5>

                    <div className="totalCartElments">
                        <div className="totalCartElmt L">
                            <h5 className="h5marg" >Order value :</h5>
                            <h5 className="h5marg" >Shipping :</h5>
                            <h5 className="h5marg" >TOTAL :</h5>
                        </div>
                        <div className="totalCartElmt R">
                            <h5 className="h5marg" >{auMillieme(totalCart)}€</h5>
                            <h5 className="h5marg" >FREE</h5>
                            <h5 className="h5marg" >{auMillieme(totalCart)}€</h5>
                        </div>
                    </div>
                </div>

            </div>
        );
    } else {
        return <Redirect to='/success' />
    }
};

export default connect(mapStateToProps, null)(Payment);
