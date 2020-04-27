import React, { useState, useReducer, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import useLocalStorage from '../../Functions/useLocalStore';
import formatDate from '../../Functions/formatDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/fontawesome-free-solid';

const SettingsForm = (props) => {
    const [showBilling, setshowBilling] = useState(false);
    const [isSend, setisSend] = useState(false);
    const [userID, setuserID] = useLocalStorage('user', []);
    const [user, setuser] = useState({
        firstname: '',
        lastname: '',
        address: '',
        optional: '',
        zipcode: '',
        city: '',
        state: '',
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
        window.scrollTo(0, 0);
        console.log('here-------', props)
        const fetchData = async () => {
            let url = '/api/getuser';
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `id=${userID}`
            })
                .then((response) => response.json())
                .then((data) => {
                    let birthday = data.user.birthday
                    if (birthday != undefined) {
                        //document.getElementById('dateDuJour').valueAsDate = birthday;
                        birthday = new Date(birthday);
                        console.log('je passse la ==========', birthday)
                    }
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
                        birthday: birthday,
                        orders: data.user.orders
                    })

                    //console.log('je recois du back avec une billing vide', data.user.billingaddress)
                    if (data.user.billingaddress != undefined) {
                        setshowBilling(true);
                    }
                });
        }
        fetchData();
    }, []);

    const submitForm = (e) => {
        e.preventDefault();
        let url = '/api/updateuserdetails';
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${userID}&firstname=${user.firstname}&lastname=${user.lastname}&email=${user.email}&gender=${user.gender}&phone=${user.phone}&birthday=${user.birthday}`
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('retour du back === ', data.status)
                if (data.status) {
                    setisSend(true);
                } else {
                    console.log('erreur')
                }
            });
    }
    const submitFormAddress = (e) => {
        e.preventDefault();
        let url = '/api/updateuseraddress';
        let body
        if (showBilling) {
            body = `id=${userID}&firstname=${user.firstname}&lastname=${user.lastname}&address=${user.address}&optional=${user.optional}&zipcode=${user.zipcode}&city=${user.city}&state=${user.state}&compagnyname=${user.compagnyname}&billingaddress=${user.billingaddress}&billingoptional=${user.billingoptional}&billingzipcode=${user.billingzipcode}&billingcity=${user.billingcity}&billingstate=${user.billingstate}`
        } else {
            body = `id=${userID}&firstname=${user.firstname}&lastname=${user.lastname}&address=${user.address}&optional=${user.optional}&zipcode=${user.zipcode}&city=${user.city}&state=${user.state}`

        }
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('retour du back === ', data.status)
                if (data.status) {
                    setisSend(true)
                } else {
                    console.log('erreur');
                }
            });
    }
    if (!isSend) {
        if (props.match.params.form === 'details') {
            return (
                <div className='settingsBloc content'>

                    <div className="backToSearch set">
                        <FontAwesomeIcon className="backArrow" icon={faArrowLeft} />
                        <h5 className="backSetting" >Back to<a href='/myaccount' className="">my Account</a>/<a href='/mysettings' className="">my Settings </a></h5>
                    </div>

                    <div className='settingsdetails'>
                        <div className='settingSubTitle'>
                            <h5 className='settingSubTitleDetailL'>My Details</h5>
                        </div>
                        <form className='settingsContent setForm' onSubmit={(e) => submitForm(e)}>
                            <label>First Name *</label>
                            <input
                                className="settingInput"
                                type="text"
                                name="firstname"
                                onChange={(e) => setuser({ ...user, firstname: e.target.value })}
                                value={user.firstname}
                                required
                            ></input>

                            <label>Last Name *</label>
                            <input
                                className="settingInput"
                                type="text"
                                name="lastname"
                                onChange={(e) => setuser({ ...user, lastname: e.target.value })}
                                value={user.lastname}
                                required
                            ></input>

                            <label>Email *</label>
                            <input
                                className="settingInput"
                                type="email"
                                name="email"
                                onChange={(e) => setuser({ ...user, email: e.target.value })}
                                value={user.email}
                                required></input>
                            <label>Date of birth *</label>
                            <input
                                className="settingInput"
                                type="date"
                                name="date"
                                id='dateDuJour'
                                onChange={(e) => setuser({ ...user, birthday: e.target.value })}
                                valueAsDate={user.birthday}
                                required
                            ></input>
                            <label>Phone</label>
                            <input
                                className="settingInput"
                                type="number"
                                name="phone"
                                onChange={(e) => setuser({ ...user, phone: e.target.value })}
                                value={user.phone}
                            ></input>
                            <label>Gender</label>
                            <select
                                className="settingInput"
                                name="gender"
                                onChange={(e) => setuser({ ...user, gender: e.target.value })} required>
                                <option value={user.gender}>{user.gender != '' ? user.gender : `--`}</option>
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                            </select>
                            <div className='setFormBtn'>
                                <input className="button log" type="submit" method="post" value="SAVE DETAILS" />
                                <Link to='/mysettings' className="cancel btnCancel" >CANCEL</Link>
                            </div>
                        </form>
                    </div>
                </div >

            );
        } else if (props.match.params.form === 'address') {
            return (
                <div className='settingsBloc content'>

                    <div className="backToSearch set">
                        <FontAwesomeIcon className="backArrow" icon={faArrowLeft} />
                        <h5 className="backSetting" >Back to<a href='/myaccount' className="">my Account</a>/<a href='/mysettings' className="">my Settings </a></h5>
                    </div>

                    <form className='settingsdetails' onSubmit={(e) => submitFormAddress(e)}>
                        <div className='settingSubTitle'>
                            <h5 className='settingSubTitleDetailL'>My Addresses</h5>
                        </div>
                        <div className='settingsContent setForm'>
                            <h5>Shipping Address</h5>
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
                            <label>City</label>
                            <input
                                className="settingInput"
                                type="text"
                                name="city"
                                onChange={(e) => setuser({ ...user, city: e.target.value })}
                                value={user.city}
                            ></input>
                            <label>State</label>
                            <input
                                className="settingInput"
                                type="text"
                                name="state"
                                onChange={(e) => setuser({ ...user, state: e.target.value })}
                                value={user.state}
                                required
                            ></input>
                            <h5 className="billingAddress" onClick={(e) => { setshowBilling(!showBilling) }}>{showBilling ? `Billing Address (if different from Shipping)` : `Add Billing Address`}</h5>
                            <div className={showBilling ? "display" : "hide"}>
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
                                    required={showBilling ? true : false}
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
                                    required={showBilling ? true : false}
                                ></input>
                                <label>City</label>
                                <input
                                    className="settingInput"
                                    type="text"
                                    name="city"
                                    onChange={(e) => setuser({ ...user, billingcity: e.target.value })}
                                    value={user.billingcity}
                                ></input>
                                <label>State</label>
                                <input
                                    className="settingInput"
                                    type="text"
                                    name="state"
                                    onChange={(e) => setuser({ ...user, billingstate: e.target.value })}
                                    value={user.billingstate}
                                    required={showBilling ? true : false}
                                ></input>
                            </div>
                        </div>
                        <div className='setFormBtn'>
                            <input className="button log" type="submit" method="post" value="SAVE DETAILS" />
                            <Link to='/mysettings' className="cancel btnCancel" >CANCEL</Link>
                        </div>
                    </form>
                </div >
            )
        }
    } else {
        return <Redirect to='/mysettings' />
    }
};

// function mapStateToProps(state) {
// 	return { user: state.user };
// }
//export default connect(mapStateToProps, null)(Conversation);
export default SettingsForm;