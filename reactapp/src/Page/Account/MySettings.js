import React, { useState, useReducer, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import useLocalStorage from '../../Functions/useLocalStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/fontawesome-free-solid';
import formatDate from '../../Functions/formatDate';
import allOptions from '../../Functions/allOptions';

const MySettings = (props) => {
    const [showBilling, setshowBilling] = useState(false)
    const [userID, setuserID] = useLocalStorage('user', []);
    const [user, setuser] = useState({
        firstname: '',
        lastname: '',
        address: '',
        optional: '',
        zipcode: '',
        city: '',
        state: '',
        newsletter: false,
        email: '',
        gender: '',
        phone: '',
        compagnyname: '',
        billingname: '',
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
        const fetchData = async () => {
            let url = '/getuser';
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `id=${userID}`
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('retour du back === ', data.user.firstname)
                    let phone = data.user.phone
                    if (phone != undefined) {
                        phone = `+33${data.user.phone}`
                    }
                    let birthday = data.user.birthday
                    if (birthday != undefined) {
                        birthday = formatDate(data.user.birthday);
                    }
                    if (data.user.billingaddress != undefined) {
                        setshowBilling(true)
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
                        phone: phone,
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

                });
        }
        fetchData();

    }, []);

    const subscribe = (e) => {
        e.preventDefault();
        let url = '/usersubcription';
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${userID}&newsletter=${!user.newsletter}`
        }).then((response) => response.json())
            .then((data) => {
                if (data.status) {
                    setuser({ ...user, newsletter: !user.newsletter });
                }
            })
    }

    return (
        <div className='settingsBloc content'>

            <a href='/myaccount' className="backToSearch">
                <FontAwesomeIcon className="backArrow" icon={faArrowLeft} />
                <h5 className="backCollec" >Back to my Account</h5>
            </a>

            <div className='settingstitle'>
                <h4>My settings</h4>
                <p>You can manage your account and subscriptions here</p>
            </div>
            <div className='settingsdetails'>
                <div className='settingSubTitle'>
                    <h5 className='settingSubTitleDetailL'>My Details</h5>
                    <Link to="/settingsform/details"
                        className='settingSubTitleDetailR'>Edit</Link>
                </div>
                <div className='settingsContent'>
                    <label>First Name</label>
                    <h5>{user.firstname}</h5>
                    <label>Last Name</label>
                    <h5>{user.lastname}</h5>
                    <label>Email</label>
                    <h5>{user.email}</h5>
                    <label>Date of birth</label>
                    <h5>{user.birthday}</h5>
                    <label>Phone</label>
                    <h5>{user.phone}</h5>
                    <label>Gender</label>
                    <h5>{user.gender}</h5>
                </div>
            </div>
            <div className='settingsdetails'>
                <div className='settingSubTitle'>
                    <h5 className='settingSubTitleDetailL'>My Addresses</h5>
                    <Link to="/settingsform/address"
                        className='settingSubTitleDetailR'>Edit</Link>
                </div>
                <div className='settingsContent'>
                    <label>Address</label>
                    <h5>{user.address}</h5>
                    <label className={allOptions(user.optional) ? 'hide' : null}>Optional</label>
                    <h5 className={allOptions(user.optional) ? 'hide' : null}>{user.optional}</h5>
                    <label>Zipcode</label>
                    <h5>{user.zipcode}</h5>
                    <label>City</label>
                    <h5>{user.city}</h5>
                    <label>State</label>
                    <h5>{user.state}</h5>
                </div>
                <div className={showBilling ? 'settingsContent' : 'hide'}>
                    <label className={allOptions(user.compagnyname) ? 'hide' : null}>Billing Name</label>
                    <h5 className={allOptions(user.compagnyname) ? 'hide' : null}>{user.compagnyname}</h5>
                    <label>Billing Address</label>
                    <h5>{user.billingaddress}</h5>
                    <label className={allOptions(user.billingoptional) ? 'hide' : null}>Optional</label>
                    <h5 className={allOptions(user.billingoptional) ? 'hide' : null}>{user.billingoptional}</h5>
                    <label>Zipcode</label>
                    <h5>{user.billingzipcode}</h5>
                    <label>City</label>
                    <h5>{user.billingcity}</h5>
                    <label>State</label>
                    <h5>{user.billingstate}</h5>
                </div>
            </div>
            <div className='settingsdetails'>
                <div className='settingSubTitle'>
                    <h5 className='settingSubTitleDetailL'>Newsletter Subscription</h5>
                    {/* <h6 className='settingSubTitleDetailR'>Edit</h6> */}
                </div>
                <div className='settingsContent'>
                    <div className='newsletterSubTitle'>
                        <label className='newsDetailL'>Newsletter Subscription</label>
                        <h5 className='newsDetailR' onClick={(e) => subscribe(e)}>{user.newsletter ? `ON` : `OFF`}</h5>
                    </div>
                </div>
            </div>
            <div className='settingsdetails'>
                <div className='settingSubTitle'>
                    <h5 className='settingSubTitleDetailL'>Privacy</h5>
                    {/* <h6 className='settingSubTitleDetailR'>Edit</h6> */}
                </div>
                <div className='settingsContent'>

                    <label className="updatePass"><Link to="/updatepass">Change Password</Link></label>
                </div>
            </div>

            {/* <div>
                    <button className="checkInOut" onClick={() => { settoShop(true) }}>CONTINUE SHOPPING</button>
                    <button className="checkInOut" onClick={() => { settoCart(true) }}>CHECKOUT</button>
                </div> */}

        </div >

    );
    // }
};

// function mapStateToProps(state) {
// 	return { user: state.user };
// }
//export default connect(mapStateToProps, null)(Conversation);
export default MySettings;