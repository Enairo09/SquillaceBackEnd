import React, { useState, useReducer, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import useLocalStorage from '../../Functions/useLocalStore';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/fontawesome-free-solid';

const UpdatePassword = (props) => {
    const [isSend, setisSend] = useState(false);
    const [userID, setuserID] = useLocalStorage('user', []);
    const [password, setpassword] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [nomatch, setnomatch] = useState(false);
    const [nomatchCurrent, setnomatchCurrent] = useState(false)
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    // const [user, setuser] = useState({
    //     firstname: '',
    //     lastname: '',
    //     address: '',
    //     optional: '',
    //     zipcode: '',
    //     city: '',
    //     state: '',
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

    // useEffect(() => {

    //     const fetchData = async () => {
    //         let url = 'http://localhost:5000/getuser';
    //         fetch(url, {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //             body: `id=${userID}`
    //         })
    //             .then((response) => response.json())
    //             .then((data) => {
    //                 setuser({
    //                     firstname: data.user.firstname,
    //                     lastname: data.user.lastname,
    //                     address: data.user.address,
    //                     optional: data.user.optional,
    //                     zipcode: data.user.zipcode,
    //                     city: data.user.city,
    //                     state: data.user.state,
    //                     newsletter: data.user.newsletter,
    //                     email: data.user.email,
    //                     gender: data.user.gender,
    //                     phone: data.user.phone,
    //                     compagnyname: data.user.compagnyname,
    //                     billingname: data.user.billingname,
    //                     billingaddress: data.user.billingaddress,
    //                     billingoptional: data.user.billingoptional,
    //                     billingzipcode: data.user.billingzipcode,
    //                     billingcity: data.user.billingcity,
    //                     billingstate: data.user.billingstate,
    //                     // password: '',
    //                     // token: String,
    //                     // salt: String,
    //                     statut: data.user.statut,
    //                     inscription: data.user.inscription,
    //                     birthday: data.user.birthday,
    //                     orders: data.user.orders
    //                 })
    //                 //console.log('je recois du back avec une billing vide', data.user.billingaddress)
    //                 if (data.user.billingaddress != undefined) {
    //                     setshowBilling(true);
    //                 }
    //             });
    //     }
    //     fetchData();
    // }, []);

    const submitForm = (e) => {
        e.preventDefault()
        if (password.confirm === password.new) {
            setnomatch(false);
            const fetchData = async () => {
                let url = '/api/changepassword';
                fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `id=${userID}&current=${password.current}&new=${password.new}&confirm=${password.confirm}`
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.status) {
                            setisSend(true);
                        } else {
                            setnomatchCurrent(true)
                        }
                    })
            };
            fetchData();
        } else {
            setnomatch(true);
        }
        console.log(password)
        // e.preventDefault();
        // let url = 'http://localhost:5000/updateuserdetails';
        // fetch(url, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        //     body: `id=${userID}&firstname=${user.firstname}&lastname=${user.lastname}&email=${user.email}&gender=${user.gender}&phone=${user.phone}&birthday=${user.birthday}`
        // })
        //     .then((response) => response.json())
        //     .then((data) => {
        //         console.log('retour du back === ', data.status)
        //         if (data.status) {
        //             setisSend(true);
        //         } else {
        //             console.log('erreur')
        //         }
        //     });
    }

    if (!isSend) {

        return (
            <div className='settingsBloc content'>

                <div className="backToSearch set">
                    <FontAwesomeIcon className="backArrow" icon={faArrowLeft} />
                    <h5 className="backSetting" >Back to<a href='/myaccount' className="">my Account</a>/<a href='/mysettings' className="">my Settings </a></h5>
                </div>

                <div className='settingsdetails'>
                    <div className='settingSubTitle'>
                        <h5 className='settingSubTitleDetailL'>Change my Password</h5>
                    </div>
                    <form className='settingsContent setForm' onSubmit={(e) => submitForm(e)}>
                        <label>Current Password *</label>
                        <input
                            className="settingInput"
                            type="password"
                            name="oldpass"
                            onChange={(e) => setpassword({ ...password, current: e.target.value })}
                            value={password.current}
                            required
                        ></input>
                        <label>New Password *</label>
                        <input
                            className="settingInput"
                            type="password"
                            name="newpass"
                            //pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            onChange={(e) => setpassword({ ...password, new: e.target.value })}
                            value={password.new}
                            required
                        ></input>

                        <label>Confirm New Password *</label>
                        <input
                            className="settingInput"
                            type="password"
                            name="newpassverif"
                            onChange={(e) => setpassword({ ...password, confirm: e.target.value })}
                            value={password.confirm}
                            required></input>
                        <div className={nomatch ? null : 'hide'}>
                            <span style={{ color: 'red' }}>Your password and confirmation password do not match <br></br>
                            This form could not be submitted. Please review your information.</span>
                        </div>
                        <div className={nomatchCurrent ? null : 'hide'}>
                            <span style={{ color: 'red' }}>Wrong Password</span>
                        </div>
                        <div className='setFormBtn'>
                            <input className="button log" type="submit" method="post" value="CHANGE PASSWORD" />
                            <Link to='/mysettings' className="cancel btnCancel" >CANCEL</Link>
                        </div>
                    </form>
                </div>
            </div>
        )
    } else {
        return <Redirect to='/mysettings' />
    }
};

export default UpdatePassword;