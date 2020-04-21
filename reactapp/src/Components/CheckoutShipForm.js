import React, { useState, useEffect, useReducer } from 'react';
import { Redirect, Link } from 'react-router-dom';
import useLocalStorage from '../Functions/useLocalStore';
import { CardElement, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import allOptions from '../Functions/allOptions';
import checkIfExist from '../Functions/checkIfExist';

const CheckoutShipForm = (props) => {
    const stripe = useStripe();
    const elements = useElements();
    const [userID, setuserID] = useLocalStorage('user', '');
    const [guestID, setguestID] = useLocalStorage('guest', '');

    const [showFormShip, setshowFormShip] = useState(false);
    const [showFormBill, setshowFormBill] = useState(false);
    const [noship, setnoShip] = useState(false);
    const [storeFormShip, setstoreFormShip] = useState({
        firstname: '',
        lastname: '',
        address: '',
        optional: '',
        zipcode: '',
        city: '',
        state: '',
        phone: ''
    });
    const [storeFormBill, setstoreFormBill] = useState({
        compagnyname: '',
        billingaddress: '',
        billingoptional: '',
        billingzipcode: '',
        billingcity: '',
        billingstate: ''
    });
    const [address, setaddress] = useState('');
    const [user, setuser] = useState({
        firstname: '',
        lastname: '',
        address: '',
        optional: '',
        zipcode: '',
        state: '',
        city: '',
        newsletter: '',
        email: '',
        gender: '',
        phone: '',
        compagnyname: '',
        billingaddress: '',
        billingoptional: '',
        billingzipcode: '',
        billingcity: '',
        billingstate: '',
        // password: '',
        // token: String,
        // salt: String,
        statut: '',
        inscription: '',
        birthday: '',
        orders: []
    });

    useEffect(() => {
        //console.log("je recois quoi ? ?? ", props.prodList);
        const fetchData = async () => {
            let url = '/getuser';
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `id=${userID}&guestID=${guestID}`
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('retour du back checkoutshipform === ', data, checkIfExist(data.address))
                    if (checkIfExist(data.user.address)) {
                        console.log('JE SUIS PASSE LA !!')
                        setuser({
                            firstname: data.user.firstname,
                            lastname: data.user.lastname,
                            address: data.user.address,
                            optional: data.user.optional,
                            zipcode: data.user.zipcode,
                            city: data.user.city,
                            state: data.user.state,
                            newsletter: data.user.newsletter,
                            email: data.user.email,
                            gender: data.user.gender,
                            phone: data.user.phone,
                            compagnyname: data.user.compagnyname,
                            billingname: data.user.billingname,
                            billingaddress: data.user.billingaddress,
                            billingoptional: data.user.billingoptional,
                            billingzipcode: data.user.billingzipcode,
                            billingcity: data.user.billingcity,
                            billingstate: data.user.billingstate,
                            // password: '',
                            // token: String,
                            // salt: String,
                            statut: data.user.statut,
                            inscription: data.user.inscription,
                            birthday: data.user.birthday,
                            orders: data.user.orders
                        })
                    } else {
                        setnoShip(true);
                    }

                });
        }
        fetchData();

    }, []);

    //je modifie mes infos de shipping
    const submitFormAddress = (e, typeForm) => {
        e.preventDefault();
        props.setnewUser(user);
        //console.log('retour formulaire ==', e.target)
        let url = '/updateuseraddress';
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${(checkIfExist(userID) ? userID : guestID)}&firstname=${user.firstname}&lastname=${user.lastname}&address=${user.address}&optional=${user.optional}&zipcode=${user.zipcode}&city=${user.city}&state=${user.state}&compagnyname=${user.compagnyname}&billingaddress=${user.billingaddress}&billingoptional=${user.billingoptional}&billingzipcode=${user.billingzipcode}&billingcity=${user.billingcity}&billingstate=${user.billingstate}`

        })
            .then((response) => response.json())
            .then((data) => {
                console.log('retour du back === ', data.status)
                if (data.status) {
                    console.log(data)
                    if (typeForm === 'Ship') {
                        setshowFormShip(false);
                    } else if (typeForm === 'Bill') {
                        setshowFormBill(false);
                    } else if (typeForm === 'NewShip') {
                        setnoShip(false);
                    }
                } else {
                    console.log('erreur');
                }
            });
    }

    const submitFormShipping = (e, typeForm) => {
        e.preventDefault();
        props.setnewUser(user);
        let url = '/addshippingaddress';
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${(checkIfExist(userID) ? userID : guestID)}&firstname=${user.firstname}&lastname=${user.lastname}&address=${user.address}&optional=${user.optional}&zipcode=${user.zipcode}&city=${user.city}&state=${user.state}`

        }).then((response) => response.json())
            .then((data) => {
                if (data.status) {
                    props.setValidShowPayment(true)
                    if (typeForm === 'Ship') {
                        setnoShip(false);
                        // props.setName("i'm from Parent")
                        //props.handleClickParent(true);
                    } else {
                        setshowFormShip(false);
                    }
                } else {
                    console.log('erreur');
                }
            });
    }
    return (
        <div>
            {/* =================================================================
            SI JE NAI PAS D'ADRESSE PREENREGISTREE JE PROPOSE LE FORMULAIRE : 
            ================================================================= */}
            <div className={noship ? null : 'hide'}  >
                {/* ====================================
            FORMULAIRE POUR Enregistrer LES INFOS DE SHIPPING
            ==================================== */}
                <form onSubmit={(e) => submitFormShipping(e, 'Ship')}>
                    <h4>{address}</h4>
                    <div className='settingsContent setForm'>
                        <h5>Shipping Address</h5>
                        <div className="popupAddressT">
                            <div className="popupAddressL">
                                <label>First Name</label>
                                <input
                                    className="settingInput"
                                    type="text"
                                    name="firstname"
                                    onChange={(e) => setuser({ ...user, firstname: e.target.value })}
                                    value={user.firstname}
                                ></input>
                            </div>
                            <div className="popupAddressR">
                                <label>Last Name</label>
                                <input
                                    className="settingInput"
                                    type="text"
                                    name="lastname"
                                    onChange={(e) => setuser({ ...user, lastname: e.target.value })}
                                    value={user.lastname}
                                    required
                                ></input>
                            </div>
                        </div>
                        <label>Address</label>
                        <input
                            className="settingInput"
                            type="text"
                            name="address"
                            onChange={(e) => setuser({ ...user, address: e.target.value })}
                            value={user.address}
                            required
                        ></input>
                        <label>Optional</label>
                        <input
                            className="settingInput"
                            type="text"
                            name="detail"
                            onChange={(e) => setuser({ ...user, optional: e.target.value })}
                            value={user.optional}
                        ></input>
                        <label>Zipcode</label>
                        <input
                            className="settingInput"
                            name="zipcode"
                            type="text"
                            pattern="[0-9]*"
                            onChange={(e) => setuser({ ...user, zipcode: e.target.value })}
                            value={user.zipcode}
                            required
                        ></input>
                        <div className="popupAddressT">
                            <div className="popupAddressL">
                                <label>City</label>
                                <input
                                    className="settingInput"
                                    type="text"
                                    name="city"
                                    onChange={(e) => setuser({ ...user, city: e.target.value })}
                                    value={user.city}
                                ></input>
                            </div>
                            <div className="popupAddressR">
                                <label>State</label>
                                <input
                                    className="settingInput"
                                    type="text"
                                    name="state"
                                    onChange={(e) => setuser({ ...user, state: e.target.value })}
                                    value={user.state}
                                    required
                                ></input>
                            </div>
                        </div>
                        <label>Contact Phone</label>
                        <input
                            className="settingInput"
                            type="text"
                            name="phone"
                            onChange={(e) => setuser({ ...user, phone: e.target.value })}
                            value={user.phone}

                        ></input>
                    </div>
                    <div className='center'>
                        <input type='submit' className="address" value='CONTINUE' />
                    </div>
                </form>
            </div>
            {/* =================================================================
             JAI UNE ADRESSE JE LAFFICHE: 
            ================================================================= */}
            <div className={noship ? 'hide' : null} >
                <div className={showFormShip ? 'hide' : "paymentSub"}>
                    <div className="paymentAddress">
                        <h5>Shipping Address</h5>
                        <h6>{user.firstname} {user.lastname}</h6>
                        <h6>{user.optional}</h6>
                        <h6>{user.address}</h6>
                        <h6>{user.zipcode} {user.city}</h6>
                        <h6>{user.state}</h6>
                        <h6 className={allOptions(user.phone) ? 'hide' : null}>Contact Phone: +33{user.phone}</h6>

                    </div>
                    <div className={(allOptions(user.billingaddress) || showFormBill) ? 'hide' : "paymentAddress"}>
                        <h5>Billing Address</h5>
                        <h6>{user.compagnyname}</h6>
                        <h6>{user.billingoptional}</h6>
                        <h6>{user.billingaddress}</h6>
                        <h6>{user.billingzipcode} {user.billingcity}</h6>
                        <h6>{user.billingstate}</h6>

                    </div>
                </div>
                <div className={showFormShip ? 'hide' : "paymentSub"}>
                    <input className='button payChangeInfo' onClick={(e) => {
                        setshowFormShip(!showFormShip);
                        setstoreFormShip({
                            firstname: user.firstname,
                            lastname: user.lastname,
                            address: user.address,
                            optional: user.optional,
                            zipcode: user.zipcode,
                            city: user.city,
                            state: user.state,
                            phone: user.phone
                        })
                    }} value='Change Shipping Info' />
                    {allOptions(user.billingaddress) ?
                        <div className="payChangeInfo" onClick={(e) => { setshowFormBill(!showFormBill) }}><FontAwesomeIcon className="icon" icon={faPlus} /> Add Billing Address</div>
                        :
                        null}
                    <input
                        className={(allOptions(user.billingstate) || showFormBill) ? 'hide' : 'button payChangeInfo'}
                        onClick={(e) => {
                            setshowFormBill(!showFormBill);
                            setstoreFormBill({
                                compagnyname: user.compagnyname,
                                billingaddress: user.billingaddress,
                                billingoptional: user.billingoptional,
                                billingzipcode: user.billingzipcode,
                                billingcity: user.billingcity,
                                billingstate: user.billingstate
                            })
                        }} value='Change Billing Info' />
                </div>

                {/* ====================================
            FORMULAIRE POUR CHANGER LES INFOS DE SHIPPING
            ==================================== */}
                {/* <div className={showFormShip ? null : 'hide'}> */}
                <form className={showFormShip ? null : 'hide'} onSubmit={(e) => submitFormShipping(e, 'correct')}>
                    <FontAwesomeIcon className="popcross" icon={faTimes} onClick={(e) => {
                        setshowFormShip(!showFormShip)
                        setuser({
                            ...user,
                            firstname: storeFormShip.firstname,
                            lastname: storeFormShip.lastname,
                            address: storeFormShip.address,
                            optional: storeFormShip.optional,
                            zipcode: storeFormShip.zipcode,
                            city: storeFormShip.city,
                            state: storeFormShip.state,
                            phone: storeFormShip.phone
                        })
                    }} />

                    <h4>{address}</h4>
                    <div className='settingsContent setForm'>
                        <h5>Shipping Address</h5>
                        <div className="popupAddressT">
                            <div className="popupAddressL">
                                <label>First Name</label>
                                <input
                                    className="settingInput"
                                    type="text"
                                    name="firstname"
                                    onChange={(e) => setuser({ ...user, firstname: e.target.value })}
                                    value={user.firstname}
                                ></input>
                            </div>
                            <div className="popupAddressR">
                                <label>Last Name</label>
                                <input
                                    className="settingInput"
                                    type="text"
                                    name="lastname"
                                    onChange={(e) => setuser({ ...user, lastname: e.target.value })}
                                    value={user.lastname}
                                    required
                                ></input>
                            </div>
                        </div>
                        <label>Address</label>
                        <input
                            className="settingInput"
                            type="text"
                            name="address"
                            onChange={(e) => setuser({ ...user, address: e.target.value })}
                            value={user.address}
                            required
                        ></input>
                        <label>Optional</label>
                        <input
                            className="settingInput"
                            type="text"
                            name="detail"
                            onChange={(e) => setuser({ ...user, optional: e.target.value })}
                            value={user.optional}
                        ></input>
                        <label>Zipcode</label>
                        <input
                            className="settingInput"
                            name="zipcode"
                            type="text"
                            pattern="[0-9]*"
                            onChange={(e) => setuser({ ...user, zipcode: e.target.value })}
                            value={user.zipcode}
                            required
                        ></input>
                        <div className="popupAddressT">
                            <div className="popupAddressL">
                                <label>City</label>
                                <input
                                    className="settingInput"
                                    type="text"
                                    name="city"
                                    onChange={(e) => setuser({ ...user, city: e.target.value })}
                                    value={user.city}
                                ></input>
                            </div>
                            <div className="popupAddressR">
                                <label>State</label>
                                <input
                                    className="settingInput"
                                    type="text"
                                    name="state"
                                    onChange={(e) => setuser({ ...user, state: e.target.value })}
                                    value={user.state}
                                    required
                                ></input>
                            </div>
                        </div>
                        <label>Contact Phone</label>
                        <input
                            className="settingInput"
                            type="number"
                            name="phone"
                            onChange={(e) => setuser({ ...user, phone: e.target.value })}
                            value={user.phone}
                        ></input>
                    </div>
                    <div className='center'>
                        <input type='submit' className="address" value='CHANGE SHIPPING ADDRESS' />
                    </div>
                </form>
                {/* ====================================
            FORMULAIRE POUR CHANGER LES INFOS DE BILLING
            ==================================== */}
                <form className={showFormBill ? null : 'hide'} onSubmit={(e) => submitFormAddress(e, 'Bill')}>
                    <FontAwesomeIcon className="popcross" icon={faTimes} onClick={(e) => {
                        setshowFormBill(!showFormBill)
                        setuser({
                            ...user,
                            compagnyname: storeFormBill.compagnyname,
                            billingaddress: storeFormBill.billingaddress,
                            billingoptional: storeFormBill.billingoptional,
                            billingzipcode: storeFormBill.billingzipcode,
                            billingcity: storeFormBill.billingcity,
                            billingstate: storeFormBill.billingstate
                        })
                    }} />
                    <h4>Billing Address</h4>
                    <div>
                        <label>Compagny Name (optional)</label>
                        <input
                            className="settingInput"
                            type="text"
                            name="compagnyname"
                            onChange={(e) => setuser({ ...user, compagnyname: e.target.value })}
                            value={user.compagnyname}
                        ></input>
                        <label>Address</label>
                        <input
                            className="settingInput"
                            type="text"
                            name="billingaddress"
                            onChange={(e) => setuser({ ...user, billingaddress: e.target.value })}
                            value={user.billingaddress}
                            required
                        ></input>
                        <label>Optional</label>
                        <input
                            className="settingInput"
                            type="text"
                            name="detail"
                            onChange={(e) => setuser({ ...user, billingoptional: e.target.value })}
                            value={user.billingoptional}
                        ></input>
                        <label>Zipcode</label>
                        <input
                            className="settingInput"
                            name="zipcode"
                            type="text"
                            pattern="[0-9]*"
                            onChange={(e) => setuser({ ...user, billingzipcode: e.target.value })}
                            value={user.billingzipcode}
                            required
                        ></input>
                        <div className="popupAddressT">
                            <div className="popupAddressL">
                                <label>City</label>
                                <input
                                    className="settingInput"
                                    type="text"
                                    name="city"
                                    onChange={(e) => setuser({ ...user, billingcity: e.target.value })}
                                    value={user.billingcity}
                                ></input>
                            </div>
                            <div className="popupAddressR">
                                <label>State</label>
                                <input
                                    className="settingInput"
                                    type="text"
                                    name="state"
                                    onChange={(e) => setuser({ ...user, billingstate: e.target.value })}
                                    value={user.billingstate}
                                    required
                                ></input>
                            </div>
                        </div>
                    </div>
                    <div className='center'>
                        <input type="submit" className="address" value="CHANGE BILLING ADDRESS" />
                    </div>
                </form>
                {/* </div> */}
                {/* ====================================
            FIN DU FORMULAIRE POUR CHANGER LES INFOS DE SHIPPING/BILLING
            ==================================== */}
            </div >
        </div>
    );
};

export default CheckoutShipForm;