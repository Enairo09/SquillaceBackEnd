import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
// import Change from '../Change';
import { connect } from 'react-redux';
import useLocalStorage from '../../Functions/useLocalStore';
import headCount from '../../Functions/headCount';

function mapStateToProps(state) {
    console.log('home page get user', state.basket)
    return { basket: state.basket }
};

const ShippingInfo = (props) => {
    const [orderID, setorderID] = useLocalStorage('order', '');
    const [productList, setproductList] = useState([]);
    const [popUp, setpopUp] = useState('nonUser');

    const [guest, setguest] = useState({
        firstname: '',
        lastname: '',
        address: '',
        optional: '',
        zipcode: '',
        city: '',
        state: '',
        phone: 'Phone',
        newsletter: true,
        email: '',
    });

    const [guestID, setguestID] = useState({
        guest_id: '',
        status: false
    })

    const [totalCart, settotalCart] = useState(0);
    const [totalProdQty, settotalProdQty] = useState(0);
    //je recupere mon produit
    useEffect(() => {
        const fetchData = async () => {

            let url = `/api/cart`
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `orderID=${orderID}`
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status) {
                        setproductList(data.basket);
                        //settotalCart(data.totalCart);
                        console.log('je verifie que je recupere le bon panier: ', data.basket)
                        settotalCart(data.totalCart);
                        settotalProdQty(headCount(data.basket));
                    } else {
                        //CREER UN MESSAGE DERREUR
                        console.log('erreur')
                    }
                })
                .catch(error => console.log("erreur fetch", error));
        }
        fetchData();
        // console.log("je recois quoi ? ?? ", props.prodList);
        // setproductList(props.prodList);
    }, []);

    let sendForm = (e) => {
        console.log('send guest', guest);
        e.preventDefault();
        let url = '/api/addguest';

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `orderID=${orderID}&firstname=${guest.firstname}&lastname=${guest.lastname}&address=${guest.address}&optional=${guest.optional}&zipcode=${guest.zipcode}&city=${guest.city}&state=${guest.state}&newsletter=${guest.newsletter}&email=${guest.email}`
        })
            .then((response) => response.json())
            .then(async (data) => {
                console.log('retour du back shipping info === ', data)
                if (data.status) {
                    await localStorage.setItem('guest', JSON.stringify(data.guestID));
                    setguestID({ guest_id: data.guestID, status: data.status })
                } else {
                    setpopUp('userExistAlready');
                }
            });
    }

    if (guestID.status) {
        return <Redirect to={{
            pathname: '/payment',
            user: { id: guestID.guest_id, status: 'guest' }
        }}
        />
    } else {
        return (
            <div className="ShipBloc content">
                <form className="checkOutForm" onSubmit={(e) => sendForm(e)}>
                    <div className="shipForm">
                        <input
                            className="checkoutInput"
                            name="firstname"
                            type="text"
                            placeholder="First Name"
                            onChange={(e) => setguest({ ...guest, firstname: e.target.value })}
                            value={guest.firstname}
                            required
                        ></input>
                        <input
                            className="checkoutInput"
                            name="lastname"
                            type="text"
                            placeholder="Last Name"
                            onChange={(e) => setguest({ ...guest, lastname: e.target.value })}
                            value={guest.lastname}
                            required
                        ></input>
                    </div>
                    <div className="shipForm">
                        <input
                            className="checkoutInput"
                            name="Address"
                            type="text"
                            placeholder="Address"
                            onChange={(e) => setguest({ ...guest, address: e.target.value })}
                            value={guest.address}
                            required
                        ></input>
                        <input
                            className="checkoutInput"
                            name="address2"
                            type="text"
                            placeholder="Optional"
                            onChange={(e) => setguest({ ...guest, optional: e.target.value })}
                            value={guest.optional}
                        ></input>
                    </div>
                    <div className="shipForm">
                        <input
                            className="checkoutInput"
                            name="ZIP Code"
                            placeholder="ZIP Code"
                            type="text"
                            pattern="[0-9]*"
                            onChange={(e) => setguest({ ...guest, zipcode: e.target.value })}
                            value={guest.zipcode}
                            required
                        ></input>
                        <input
                            className="checkoutInput"
                            name="city"
                            type="text"
                            placeholder="City/Town"
                            onChange={(e) => setguest({ ...guest, city: e.target.value })}
                            value={guest.city}
                            required
                        ></input>
                    </div>
                    <div className="shipForm">
                        <input
                            className="checkoutInput"
                            name="state"
                            type="text"
                            placeholder="State"
                            onChange={(e) => setguest({ ...guest, state: e.target.value })}
                            value={guest.state}
                            required
                        ></input>
                        <input
                            className="checkoutInput"
                            name="phone"
                            type="tel"
                            placeholder="Phone"
                            onChange={(e) => setguest({ ...guest, phone: e.target.value })}
                            pattern="^[0-9]{10}$"
                            value={guest.phone}
                            required
                        ></input>
                    </div>
                    <div className="shipForm">
                        <input
                            className="checkoutInput"
                            name="email"
                            type="email"
                            placeholder="Email"
                            onChange={(e) => setguest({ ...guest, email: e.target.value })}
                            value={guest.email}
                            required
                        ></input>

                    </div>
                    <div className="shipCheckbox">
                        <input
                            className="checkboxInput"
                            name="Checkbox"
                            type="checkbox"
                            onChange={(e) => { setguest({ ...guest, newsletter: e.target.checked }) }}
                            value={guest.newsletter}
                        ></input>
                        <label>I wish to receive Squillace's newsletter</label>
                    </div>
                    <div className={`shipForm ${popUp}`} >
                        <h5 className='logLink'>There is already an account associated with this email, please : </h5>
                        <Link className='logLink2' to='/checkout'>Log In</Link>
                    </div>
                    <input
                        className="button log"
                        name="Checkout"
                        type="submit"
                        value="CONTINUE"
                    ></input>

                </form>
                <div className="totalCart" style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <h5 className="h5marg">SHOPPING BAG TOTAL
                ({totalProdQty} items)
                </h5>
                    <h5 className="h5marg">Log in to order with your account</h5>
                    <Link to="/login" className="cartLink">
                        <button className="btnCart" >SIGN IN</button>
                    </Link>
                    <div className="totalCartElments">
                        <div className="totalCartElmt L">
                            <h5 className="h5marg" >Order value :</h5>
                            <h5 className="h5marg" >Shipping :</h5>
                            <h5 className="h5marg" >TOTAL :</h5>
                        </div>
                        <div className="totalCartElmt R">
                            <h5 className="h5marg" >{totalCart}€</h5>
                            <h5 className="h5marg" >FREE</h5>
                            <h5 className="h5marg" >{totalCart}€</h5>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
};

export default connect(mapStateToProps, null)(ShippingInfo);
//export default ShippingInfo;
