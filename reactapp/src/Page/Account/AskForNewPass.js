import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import useLocalStorage from '../../Functions/useLocalStore';
import checkIfExist from '../../Functions/checkIfExist';
import PopUpRetrievePassSent from '../../Components/PopUpRetrievePassSent';

const AskForNewPass = (props) => {
    const [olduser, setolduser] = useState({
        email: '',
        password: '',
    });

    const [isSent, setisSent] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    // j'envoie un mail pour reset le password user 
    const resetpass = (e) => {
        e.preventDefault();

        let url = '/api/askfornewpass';
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, //encodage
            body: `email=${olduser.email}`
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('hello reset ============', data)
                if (data.status) {
                    if (data.msg === 'success') {
                        setisSent(true)
                    } else {
                        alert("Error ! Please try again");
                    }
                } else {
                    function myFunction() {
                        alert("There is no account registered with this email !");
                    }
                    myFunction();
                }
            });
    };


    return (
        <div className="blocSignIn content">
            {isSent ? <PopUpRetrievePassSent content="Thank You ! You will receive an email to reset your password in a few minutes" link="/signin" /> : null}
            <form className="formfull" onSubmit={(e) => resetpass(e)}>
                <h2>FORGOT YOUR PASSWORD?</h2>
                <span className="logContent">
                    <h5>If you cannot remember your password, enter your email address and we'll send you details on how to recover it.</h5>

                    <label>Email</label>
                    <input
                        type="email"
                        className="Login-input"
                        name="login_email"
                        placeholder="Votre email"
                        onChange={(e) => setolduser({ ...olduser, email: e.target.value })}
                        value={olduser.email}
                        required
                    />

                    <div>
                        <Link className="resetPass L" to="/signin">Remember it ? Sign In</Link>
                        <Link className="resetPass R" to={{ pathname: '/signin', query: { notRegistered: true } }}>Not registered yet ? Create an Account</Link>
                    </div>
                </span>
                <input className="button log" type="submit" method="post" value="RETRIEVE PASSWORD" />
            </form>

        </div >
    );

}

export default AskForNewPass;