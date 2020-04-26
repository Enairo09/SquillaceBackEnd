import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Products from './Page/Shop/Products';
import Form from './Page/Form';
import Login from './Page/Login';
import Logout from './Page/Logout';
import Header from './Nav/Header';
import Change from './Page/Change';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import allOptions from './Functions/allOptions';

import HomePage from './Page/HomePage';
import About from './Page/About';
import Collection from './Page/CollectionFW20';
import Cart from './Page/Shop/Cart';
import ProductCard from './Page/Shop/ProductCard';
import Contact from './Page/Contact';
import Checkout from './Page/Checkout/Checkout';
import ShippingInfo from './Page/Checkout/ShippingInfo';
import MyAccount from './Page/Account/MyAccount';
import MySettings from './Page/Account/MySettings';
import Payment from './Page/Checkout/Payment';
import headCount from './Functions/headCount';
import useLocalStorage from './Functions/useLocalStore';
import SettingsForm from './Page/Account/SettingsForm';
import UpdatePassword from './Page/Account/UpdatePassword';


import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import checkIfExist from './Functions/checkIfExist';
import Success from './Page/Checkout/Success';

library.add(fas);


function mapStateToProps(state) {
  console.log('APP get store', state)
  return { userName: state.user, count: state.count }
}

function App(props) {
  const [userID, setuserID] = useLocalStorage('user', '');
  const [orderID, setorderID] = useLocalStorage('order', '');
  const [productList, setproductList] = useState([]);
  const [user, setuser] = useState('')
  const [countBasket, setcountBasket] = useState(0);

  useEffect(() => {
    props.newOrder(orderID);
    props.newUser(userID);


    const fetchData = async () => {
      let url = '/api/get-order-and-user-from-storage';
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `order=${orderID}&user=${userID}`
      })
        .then((response) => response.json())
        .then(async (data) => {
          await setproductList(data.basket);
          await props.newBasket(data.basket);
          await props.newCount(headCount(data.basket));
          await setcountBasket(headCount(data.basket));
          await localStorage.setItem('count', JSON.stringify(headCount(data.basket)));
          if (checkIfExist(data.orderID)) {
            await localStorage.setItem('order', JSON.stringify(data.orderID));
          }
        });
    };
    fetchData();

    props.newCount(countBasket)
  }, []);

  if (checkIfExist(props.userName)) {
    console.log('je passe dans le if APP', props.userName)
    return (
      <div className="App">

        <Router>
          <Switch>
            <div>
              <Header count={props.count} user={checkIfExist(props.userName)} />
              {/* <Route
                path='/dashboard'
                render={(props) => <Dashboard {...props} isAuthed={true} />}
              /> */}
              <Route path="/" exact component={HomePage} />
              <Route path="/products" exact component={Products} />
              <Route path="/form" component={Form} />
              <Route path="/signout" component={Logout} />
              <Route path="/signin" component={Login} />
              <Route path="/change" component={Change} />
              <Route path="/about" component={About} />
              <Route path="/collection" component={Collection} />
              <Route path="/cart" component={Cart} />
              <Route path="/prodcard/:id" component={ProductCard} />
              <Route path="/contact" component={Contact} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/shippinginfo" component={ShippingInfo} />
              <Route path="/signout" component={Logout} />
              {/* <Route
                path='/signout'
                render={(props) => <Logout {...props} user={checkIfExist(props.userName)} />}
              /> */}
              <Route path="/myaccount" component={MyAccount} />
              <Route path="/payment" component={Payment} />
              <Route path="/mysettings" component={MySettings} />
              <Route path="/settingsform/:form" component={SettingsForm} />
              <Route path="/updatepass" component={UpdatePassword} />
              <Route path="/success" component={Success} />
            </div>
          </Switch>
        </Router>
      </div>
    )
  } else {
    console.log('je passe dans le else APP', props.userName)
    return (
      <div className="App">

        <Router>
          <Switch>
            <div>
              <Header count={props.count} user={checkIfExist(props.userName)} />
              <Route path="/" exact component={HomePage} />
              <Route path="/products" exact component={Products} />
              <Route path="/form" component={Form} />
              <Route path="/signout" component={Logout} />
              <Route path="/signin" component={Login} />
              <Route path="/change" component={Change} />
              <Route path="/about" component={About} />
              <Route path="/collection" component={Collection} />
              <Route path="/cart" component={Cart} />
              <Route path="/prodcard/:id" component={ProductCard} />
              <Route path="/contact" component={Contact} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/shippinginfo" component={ShippingInfo} />
              <Route path="/payment" component={Payment} />
              <Route path="/success" component={Success} />

            </div>
          </Switch>
        </Router>
      </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(App);
//export default App;
