import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import headCount from '../../Functions/headCount';
import useLocalStorage from '../../Functions/useLocalStore';
import checkIfExist from '../../Functions/checkIfExist';

function mapStateToProps(state) {
    console.log('home page get user', state.basket)
    return { prodList: state.basket }
}

const Checkout = (props) => {
    const [userID, setuserID] = useLocalStorage('user', '');
    const [orderID, setorderID] = useLocalStorage('order', '');
    const [user, setuser] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
    });

    const [olduser, setolduser] = useState({
        email: '',
        password: '',
    });

    const [isLogged, setisLogged] = useState(false);

    const [guestID, setguestID] = useState({
        guest_id: '',
        status: false
    })
    const [userAssociate, setuserAssociate] = useState(false);
    const [clickCreate, setclickCreate] = useState(false);
    //const [userToSend, setuserToSend] = useState('');

    //je recupere mon produit
    useEffect(() => {
        window.scrollTo(0, 0);
        console.log("je recois quoi ? ?? ", props.prodList);
        const fetchData = async () => {
            let url = '/api/get-user-from-order';
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `orderID=${orderID}&userID=${userID}`
            })
                .then((response) => response.json())
                .then(async (data) => {
                    if (checkIfExist(data.userEmail)) {
                        console.log('retour checkout', data);
                        setolduser({ ...olduser, email: data.userEmail });
                        setuserAssociate(true);
                    } else {
                        setuserAssociate(false);
                    }
                });
        }
        fetchData();


    }, []);

    //je me connecte
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
                        //await setuserToSend(data.id);
                        await localStorage.setItem('user', JSON.stringify(data.id));
                        await localStorage.setItem('order', JSON.stringify(data.order));
                        await localStorage.setItem('count', JSON.stringify(headCount(data.basket)));
                        props.newUser(data.id);
                        props.newOrder(data.order);
                        props.newBasket(data.basket);
                        props.newCount(headCount(data.basket));
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
    // je cree un nouvel user
    const login = (e) => {
        e.preventDefault();
        let url = '/api/newuser';

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
                        //await setuserToSend(data.id);
                        await localStorage.setItem('user', JSON.stringify(data.id));
                        props.newUser(data.id);
                    }
                    update();
                    setisLogged(true);
                } else {
                    function myFunction() {
                        alert("Un compte est déjà associé à cet email");
                    }
                    myFunction();
                }
            });
    };

    if (isLogged) {
        return (
            <Redirect to={{
                pathname: '/payment',
                user: { id: guestID.guest_id, status: 'user' }
            }} />
        )
    } else {
        return (
            <div className="blocCheckout">
                {clickCreate ? null :

                    <form className={userAssociate ? "form loginCheckoutBIG" : "form loginCheckout"} onSubmit={(e) => loginUser(e)} >
                        {userAssociate ? <h2>Welcome Back ! <br></br><br></br>Log In</h2> : <h2>LOG IN</h2>}
                        <span className="logContent">
                            <label>Email</label>
                            <input
                                className="Login-input"
                                name="login_email"
                                placeholder="Votre email"
                                onChange={(e) => setolduser({ ...olduser, email: e.target.value })}
                                value={olduser.email}
                                required
                            />
                            <label>Password</label>
                            <input
                                type="password"
                                className="Login-input"
                                name="login_password"
                                placeholder="Votre mot de passe"
                                onChange={(e) => setolduser({ ...olduser, password: e.target.value })}
                                value={olduser.password}
                                required
                            />
                            <Link className="resetPass">Forgot your password ?</Link>
                        </span>
                        <input className="button log" type="submit" method="post" value="LOG IN" />
                    </form>
                }
                {userAssociate ? null :
                    <form className={clickCreate ? "form loginCheckoutBIG" : "form loginCheckout"} onSubmit={(e) => login(e)}>
                        <h2>REGISTER</h2>
                        <span className="logContent">
                            <h5>If you still don't have a Squillace account, <br></br>use this registration form to join in.</h5>
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
                        </span>
                        <input className="button log" type="submit" method="post" value='CREATE ACCOUNT' />
                    </form>
                }
                <form className="form guestCheckout">
                    <h2>SHOP AS GUEST</h2>
                    <span className="logContent">
                        You can complete your purchase as a guest, but you will need to fill out your details to place your order.<br></br>

                    You will be able to register and save your details for future purchases at the end of the order process.
                    </span>
                    <Link to="/shippinginfo" className="cartLink">
                        <input className="button log" type="submit" method="post" value="CONTINUE AS GUEST" />
                    </Link>
                    {userAssociate ?
                        <div>
                            <h2>NEW CUSTOMER</h2>
                            <span className="logContent">
                                Create a new account
                            </span>
                            <input className="button log" type="submit" method="post" onClick={(e) => { setuserAssociate(false); setclickCreate(true) }} value='CREATE ACCOUNT' />
                        </div>
                        : null}
                </form>
            </div>
        );
    }
};


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

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
