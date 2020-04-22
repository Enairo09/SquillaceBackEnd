import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
// import Change from '../Change';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPlus, faMinus, faMinusCircle } from '@fortawesome/fontawesome-free-solid';
import useLocalStorage from '../../Functions/useLocalStore';
import formatDate from '../../Functions/formatDate';
import checkIfExist from '../../Functions/checkIfExist';
import headCount from '../../Functions/headCount';

function mapStateToProps(state) {
    console.log('Account get user', state.user)
    return { name: state.user }
}

const MyAccount = (props) => {
    const [userID, setuserID] = useLocalStorage('user', []);
    const [user, setuser] = useState({
        firstname: '',
        lastname: '',
        // address: '',
        // optional: '',
        // zipcode: '',
        // state: '',
        // city: '',
        // newsletter: '',
        email: '',
        // gender: '',
        // phone: '',
        // compagnyname: '',
        // billingname: '',
        // billingaddress: '',
        // billingoptional: '',
        // billingzipcode: '',
        // billingcity: '',
        // billingstate: '',
        // // password: '',
        // // token: String,
        // // salt: String,
        // statut: '',
        // inscription: '',
        // birthday: '',
        // orders: []
    });
    const [orders, setorders] = useState([]);
    // const [orderToDisplay, setorderToDisplay] = useState({
    //     id: '',
    //     productList: [],
    //     display: false
    // });
    const [name, setname] = useState(false);

    //je recupere mon produit
    useEffect(() => {
        //console.log("je recois quoi ? ?? ", props.prodList);
        const fetchData = async () => {
            let url = '/api/myaccount';
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `id=${userID}`
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('retour du back === ', data.user.firstname)
                    setuser({
                        firstname: data.user.firstname,
                        lastname: data.user.lastname,
                        // address: data.user.address,
                        // optional: data.user.optional,
                        // zipcode: data.user.zipcode,
                        // city: data.user.city,
                        // state: data.user.state,
                        // newsletter: data.user.newsletter,
                        email: data.user.email,
                        // gender: data.user.gender,
                        // phone: data.user.phone,
                        // compagnyname: data.user.compagnyname,
                        // billingname: data.user.billingname,
                        // billingaddress: data.user.billingaddress,
                        // billingoptional: data.user.billingoptional,
                        // billingzipcode: data.user.billingzipcode,
                        // billingcity: data.user.billingcity,
                        // billingstate: data.user.billingstate,
                        // // password: '',
                        // // token: String,
                        // // salt: String,
                        // statut: data.user.statut,
                        // inscription: data.user.inscription,
                        // birthday: data.user.birthday,
                        // orders: data.user.orders
                    })
                    setorders(data.orders);
                    if (data.user.firstname != undefined) {
                        setname(true);
                    }
                });
        }
        fetchData();
    }, []);

    let getOrder = async (id, key) => {
        console.log('id a afficher', id, key)
        // await setorderToDisplay({ ...orderToDisplay, id: id, display: true, productList: orders[key].productList })
        // console.log('orderto display', orderToDisplay)
        document.getElementById(`${key}`).className = "showOrderDetails";
        document.getElementById(`bloc${key}`).className = "orderCardExpand";
        document.getElementById(`img${key}`).className = "hide";
        document.getElementById(`show${key}`).className = "hide";
        document.getElementById(`OrderInfo${key}`).className = "hide";
        document.getElementById(`showless${key}`).className = "displayOrder";
        document.getElementById(`fullOrderInfo${key}`).className = "fullOrderInfo";
        document.getElementById(`OrderTitle${key}`).className = "orderTitles";
        //console.log(elt)
    }

    let showLess = async (id, key) => {
        console.log('id a afficher', id, key)
        // await setorderToDisplay({ ...orderToDisplay, id: id, display: false, productList: orders[key].productList })
        // console.log('order to display', orderToDisplay)
        document.getElementById(`${key}`).className = "hide";
        document.getElementById(`bloc${key}`).className = "orderCard";
        document.getElementById(`showless${key}`).className = "hide";
        document.getElementById(`fullOrderInfo${key}`).className = "hide";
        document.getElementById(`OrderTitle${key}`).className = "hide";

        document.getElementById(`img${key}`).className = "accountPic";
        document.getElementById(`show${key}`).className = "displayOrder";
        document.getElementById(`OrderInfo${key}`).className = "orderDetails";

        //console.log(elt)
    }


    var orderList = orders.map((order, i) => {
        var productList = order.productList.map((product, i) => {
            return (
                <div className="productListAccount">

                    <img className="accountPic" src={product.img} />
                    <div className="prodListDetail">
                        <h5 style={{ fontWeight: 'bold' }}>{product.name}</h5>
                        <h5>{product.size}</h5>
                        <h5>{(product.price / product.quantity)}€</h5>
                        <h5>Quantity : {product.quantity}</h5>
                        <div className="prodListDetailPrice">
                            <h5 style={{ fontWeight: 'bold' }}>{product.price}€</h5>
                        </div>
                    </div>
                </div>
            )
        })
        return (
            <div className="orderCard" id={`bloc${i}`} >
                <img className="accountPic" id={`img${i}`} src={order.productList[0].img} />
                <span className="orderCardSub">
                    <div className='hide' onClick={(e) => showLess(order._id, i)} id={`showless${i}`}>
                        <h5 className='showdetail'>Show less</h5>
                        <FontAwesomeIcon className="settingHeadR" icon={faMinus} />
                    </div>
                    <h3 className='order'>Order  -  {formatDate(order.validationdate)}</h3>
                    <span className='orderDetails' id={`OrderInfo${i}`}>
                        <h5>Ref : {order._id}</h5>
                        <h5>Status : fulfilled</h5>
                        <h5>Date : {formatDate(order.validationdate)}</h5>
                        <h5>Total : {order.totalorder}€</h5>
                    </span>
                    <h5 className='hide' id={`OrderTitle${i}`}>Order Details</h5>
                    <div className="hide" id={`fullOrderInfo${i}`}>

                        <span className={checkIfExist(order.billingaddress) ? 'orderDetailsExpandthreeL' : 'orderDetailsExpandL'}>
                            <h5 style={{ fontWeight: 'bold' }}>Shipping Address</h5>
                            <h5 style={{ marginBottom: 2, }}>{order.firstname} {order.lastname}</h5>
                            <h5 style={{ marginBottom: 2, marginTop: 2 }}>{order.optional}</h5>
                            <h5 style={{ marginBottom: 2, marginTop: 2 }}>{order.address}</h5>
                            <h5 style={{ marginBottom: 2, marginTop: 2 }}>{order.zipcode} {order.city}</h5>
                            <h5 style={{ marginBottom: 2, marginTop: 2 }}>{order.state}</h5>
                        </span>
                        {checkIfExist(order.billingaddress) ?
                            <span className='orderDetailsExpandM'>
                                <h5 style={{ fontWeight: 'bold' }}>Billing Address</h5>
                                <h5 style={{ marginBottom: 2 }}>{order.compagnyname}</h5>
                                <h5 style={{ marginBottom: 2, marginTop: 2 }}>{order.billingoptional}</h5>
                                <h5 style={{ marginBottom: 2, marginTop: 2 }}>{order.billingaddress}</h5>
                                <h5 style={{ marginBottom: 2, marginTop: 2 }}>{order.billingzipcode} {order.billingcity}</h5>
                                <h5 style={{ marginBottom: 2, marginTop: 2 }}>{order.billingstate}</h5>
                            </span> : null}
                        <span className={checkIfExist(order.billingaddress) ? 'orderDetailsExpandthreeR' : 'orderDetailsExpandR'}>
                            {/* <h5>Ref : {order._id}</h5>
                            <h5>Status : fulfilled</h5> */}
                            <h5>Date : {formatDate(order.validationdate)}</h5>
                            <h5 style={{ fontWeight: 'bold' }}>Total : {order.totalorder}€</h5>
                        </span>

                    </div>
                    <div className='displayOrder' onClick={(e) => getOrder(order._id, i)} id={`show${i}`}>
                        <h5 className='showdetail'>Show more</h5>
                        <FontAwesomeIcon className="settingHeadR" icon={faPlus} />
                    </div>
                    <div id={i} className='hide'>
                        <h5 className='orderTitles'>Order Summary</h5>
                        {productList}
                        <div className='resumeOrder'>
                            <h5 className="prodListTotalQty">{headCount(order.productList)} items</h5>
                            <h5 className="prodListTotalPrice">Total : {order.totalorder}€</h5>
                        </div>
                    </div>
                </span>

                {/* <div>
              <button className='change-btn' onClick={(e) => { addProduct(e.target.value) }} value={product._id}>Ajouter au panier</button>
            </div> */}
            </div >
        )
    });


    return (
        <div className="accountBloc content">
            <div className="accountsetting">
                <h3>Hello {name ? `${user.firstname} ${user.lastname}` : user.email}</h3>
                <div className="mobil">
                    {/* <Link to="/wishlist" className="linkaccount">
                    <h5 className="settingHeadL">My Wishlist</h5>
                    <FontAwesomeIcon className="settingHeadR" icon={faArrowRight} /></Link> */}
                    <Link to="/myaccount" className="linkaccount">
                        <h5 className="settingHeadL">My Purchases</h5>
                        <FontAwesomeIcon className="settingHeadR" icon={faArrowRight} /></Link>
                    <Link to="/mysettings" className="linkaccount">
                        <h5 className="settingHeadL">My Settings</h5>
                        <FontAwesomeIcon className="settingHeadR" icon={faArrowRight} /></Link>
                    {/* <Link to="/mysettings" className="linkaccount">
                    <h5 className="settingHeadL">My Payment Info</h5>
                    <FontAwesomeIcon className="settingHeadR" icon={faArrowRight} /></Link> */}
                    <Link to="/signout" className="linkaccount">
                        <h5 className="settingHeadL">Log Out</h5>
                        <FontAwesomeIcon className="settingHeadR" icon={faArrowRight} /></Link>
                    <h5>Need Help ?</h5>
                    <Link to="/contact" className="linkaccount">
                        <h5 className="settingHeadL">Contact Us</h5>
                        <FontAwesomeIcon className="settingHeadR" icon={faArrowRight} /></Link>
                </div>
            </div>
            {/* <div className="form"> */}


            <div className="accountOrder">
                <h3>My Purchases</h3>
                {orderList}
            </div>

            {/* </div> */}
        </div>
    );

};

export default connect(mapStateToProps, null)(MyAccount);
