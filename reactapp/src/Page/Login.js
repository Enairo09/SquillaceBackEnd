import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import allOptions from '../Functions/allOptions';
import useLocalStorage from '../Functions/useLocalStore';
import headCount from '../Functions/headCount';
import checkIfExist from '../Functions/checkIfExist';

const Login = (props) => {
    const [user, setuser] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
    });

    const [orderID, setorderID] = useLocalStorage('order', '');
    const [guestID, setguestID] = useLocalStorage('guest', '');

    const [olduser, setolduser] = useState({
        email: '',
        password: '',
    });

    const [isLogged, setisLogged] = useState(false);

    const [userToSend, setuserToSend] = useState('');
    const [notRegistered, setnotRegistered] = useState(false);

    useEffect(() => {
        if (checkIfExist(props.location.query)) {
            if (props.location.query.notRegistered) {
                setnotRegistered(true)
            }
        }
    }, [])
    // je cree un nouvel user
    const login = (e) => {
        e.preventDefault();

        let url = '/api/newuser';
        // let body = `orderID=${orderID}&email=${user.email}&password=${user.password}&statut=user`
        // if (allOptions(orderID)) {
        //     body = `email=${user.email}&password=${user.password}&statut=user&order=${orderID}`
        // }
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, //encodage
            //body: `firstname=${user.firstname}&lastname=${user.lastname}&email=${user.email}&password=${user.password}`
            body: `email=${user.email}&password=${user.password}&statut=user&orderID=${orderID}`
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('hello ============', data.status)
                if (data.status) {
                    const update = async () => {
                        await setuserToSend(data.id);
                        await localStorage.setItem('user', JSON.stringify(data.id));
                        await props.newUser(data.id);
                        if (checkIfExist(guestID)) {
                            await window.localStorage.removeItem('guest');
                        }
                    }

                    update();
                    setisLogged(true);
                } else {
                    function myFunction() {
                        alert("An account already exist for this email address");
                    }
                    myFunction();
                }
            });
    };

    //je me connecte
    const loginUser = (e) => {
        e.preventDefault();
        let url = '/api/login';

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `email=${olduser.email}&password=${olduser.password}&orderID=${orderID}`
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("hello ======", data)
                if (data.status) {
                    const update = async () => {
                        await setuserToSend(data.id);
                        await localStorage.setItem('user', JSON.stringify(data.id));
                        await localStorage.setItem('order', JSON.stringify(data.order));
                        await localStorage.setItem('count', JSON.stringify(headCount(data.basket)));
                        props.newUser(data.id);
                        props.newOrder(data.order);
                        props.newBasket(data.basket);
                        props.newCount(headCount(data.basket));
                        if (checkIfExist(guestID)) {
                            await window.localStorage.removeItem('guest');
                        }
                    }
                    update();
                    setisLogged(true);
                } else {
                    function myFunction() {
                        alert("le mot de passe et l'email ne correspondent pas");
                    }
                    myFunction();
                }
            });
    };

    if (isLogged) {
        return <Redirect to={{ pathname: '/', user: userToSend }} />;
    } else {
        return (
            <div className="blocSignIn content">
                {notRegistered ? null :
                    <form className={notRegistered ? "form" : "formfull"} onSubmit={(e) => loginUser(e)}>
                        <h2>LOG IN</h2>
                        <span className="logContent">
                            <label>Email</label>
                            <input
                                type="email"
                                className="Login-input"
                                name="login_email"
                                placeholder="Your email"
                                onChange={(e) => setolduser({ ...olduser, email: e.target.value })}
                                value={olduser.email}
                                required
                            />
                            <label>Password</label>
                            <input
                                type="password"
                                className="Login-input"
                                name="login_password"
                                placeholder="Your password"
                                onChange={(e) => setolduser({ ...olduser, password: e.target.value })}
                                value={olduser.password}
                                required
                            />
                            <div>
                                <Link className="resetPass L" to="/askfornewpass">Forgot your password ?</Link>
                                <Link className="resetPass R" onClick={(e) => setnotRegistered(true)}>Not registered yet ? Create an Account</Link>
                            </div>
                        </span>
                        <input className="button log" type="submit" method="post" value="LOG IN" />
                    </form>
                }
                {
                    notRegistered ?
                        <form className={notRegistered ? "formfull" : "form"} onSubmit={(e) => login(e)}>
                            <h2>REGISTER</h2>
                            <span className="logContent">
                                <h5 >If you still don't have a Squillace account, use this registration form to join in.</h5>
                                {/* <label>First Name</label>
                        <input
                            type='text'
                            className="Login-input"
                            name="firstname"
                            placeholder="your first name"
                            onChange={(e) => setuser({ ...user, firstname: e.target.value })}
                            value={user.firstname}
                            required
                        />
                        <label>Last Name</label>
                        <input
                            type='text'
                            className="Login-input"
                            name="lastname"
                            placeholder="your last name"
                            onChange={(e) => setuser({ ...user, lastname: e.target.value })}
                            value={user.lastname}
                            required
                        /> */}
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="Login-input"
                                    name="login_email"
                                    placeholder="Votre email"
                                    onChange={(e) => setuser({ ...user, email: e.target.value })}
                                    value={user.email}
                                    required
                                />
                                <label>Password
                    </label>
                                <input
                                    type="password"
                                    className="Login-input"
                                    name="login_password"
                                    placeholder="Votre mot de passe"
                                    onChange={(e) => setuser({ ...user, password: e.target.value })}
                                    value={user.password}
                                    required
                                />

                                <Link className="resetPass" onClick={(e) => setnotRegistered(false)}>Already registered ? Please Sign In</Link>

                            </span>
                            <input className="button log" type="submit" method="post" value='CREATE ACCOUNT' />
                        </form>
                        : null
                }
            </div >
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        newUser: function (userToSend) {
            console.log('je suis dans le NEW USER REDUCER', userToSend)
            dispatch({ type: 'setUser', user: userToSend })
        },
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
}

export default connect(null, mapDispatchToProps)(Login);