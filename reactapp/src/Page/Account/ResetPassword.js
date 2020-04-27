import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import useLocalStorage from '../../Functions/useLocalStore';
import checkIfExist from '../../Functions/checkIfExist';
import PopUpRetrievePassSent from '../../Components/PopUpRetrievePassSent';
import { set } from 'mongoose';



const ResetPass = (props) => {
    const [user, setuser] = useState({
        newpass: "",
        confirmpass: ""
    });

    const [isSent, setisSent] = useState(false);
    const [showNo, setshowNo] = useState(false);
    const [popUp, setpopUp] = useState({
        status: false,
        content: '',
        link: ''
    });
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    // j'envoie un mail pour reset le password user 
    const resetpass = (e) => {
        e.preventDefault();

        if (user.confirmpass === user.newpass) {
            let url = '/api/resetpassword';
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, //encodage
                body: `token=${props.match.params.token}&newpass=${user.newpass}`
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('hello reset ============', data)
                    if (data.status) {
                        setpopUp({ status: true, content: "Your password has been successfully changed !", link: "/signin" })
                    } else {
                        setpopUp({ status: true, content: "Your reset password link is expired. Please try again", link: "/askfornewpass" })
                    }

                    //     update();
                    //     setisSent(true);
                    // } else {
                    //     function myFunction() {
                    //         alert("Un compte est déjà associé à cet email");
                    //     }
                    //     myFunction();
                    // }
                });
        } else {
            setshowNo(true)
        }
    };

    return (
        <div className="blocSignIn content">
            {popUp.status ? <PopUpRetrievePassSent content={popUp.content} link={popUp.link} /> : null}
            <form className="formfull" onSubmit={(e) => resetpass(e)}>
                <h2>RESET PASSWORD</h2>
                <span className="logContent">
                    <label>New Password</label>
                    <input
                        type="password"
                        className="Login-input"
                        name="login_password"
                        placeholder="enter new password"
                        onChange={(e) => setuser({ ...user, newpass: e.target.value })}
                        value={user.newpass}
                        required
                    />
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        className="Login-input"
                        name="login_password"
                        placeholder="confirm new password"
                        onChange={(e) => setuser({ ...user, confirmpass: e.target.value })}
                        value={user.confirmpass}
                        required
                    />
                    {showNo ? <h5 style={{ color: "red" }}>Passwords do not match. Please try again</h5> : null}
                    {/* <div>
                            <Link className="resetPass L" to="/signin">Remember it ? Sign In</Link>
                            <Link className="resetPass R" onClick={(e) => setnotRegistered(true)}>Not registered yet ? Create an Account</Link>
                        </div> */}
                </span>
                <input className="button log" type="submit" method="post" value="UPDATE PASSWORD" />
            </form>

        </div >
    );

}


export default ResetPass;