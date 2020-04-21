import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import auMillieme from '../../Functions/roundNum';
import updatePriceQty from '../../Functions/updateCart';
import useLocalStorage from '../../Functions/useLocalStore';
import headCount from '../../Functions/headCount';
import checkIfExist from '../../Functions/checkIfExist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus, faMinus } from '@fortawesome/fontawesome-free-solid';

function mapStateToProps(state) {
    //console.log('Cart get user', state)
    return { basket: state.basket }
}

const Cart = (props) => {
    const [productList, setproductList] = useState([]);
    const [guestID, setguestID] = useLocalStorage('guest', '');
    const [orderID, setorderID] = useLocalStorage('order', '');
    const [userID, setuserID] = useLocalStorage('user', '');
    const [totalCart, settotalCart] = useState(0);
    const [totalProdQty, settotalProdQty] = useState(0);

    const [storeId, setstoreId] = useState('');

    useEffect(() => {
        //console.log('PROPS', props.prodList)
        //setproductList(props.basket)
        //console.log('JE RECOIS DANS LE CART', productList);
        //console.log('calcul prix', totalProdQty)

        const fetchData = async () => {

            let url = `/cart`
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `orderID=${orderID}`
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status) {
                        setproductList(data.basket);
                        //settotalCart(data.totalCart);
                        console.log('je verifie que je recupere le bon panier: ', data.basket)
                        settotalCart(data.totalCart);
                        settotalProdQty(headCount(data.basket));
                    } else {
                        //CREER UN MESSAGE DERREUR
                        console.log('erreur')
                    }
                })
                .catch(error => console.log("erreur fetch", error));
        }
        fetchData();
    }, []);

    //supprimer du panier 
    let deleteproduct = async (id) => {
        let url = `/delete-product-from-order`
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `orderID=${orderID}&_id=${id}`
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === true) {
                    //settotalCart(data.totalCart);
                    console.log('je verifie le retour du back : ', data)
                    setproductList(data.basket);
                    settotalCart(data.totalCart);
                    settotalProdQty(headCount(data.basket));
                    props.newBasket(data.basket);
                    props.newCount(headCount(data.basket));

                    localStorage.setItem('count', JSON.stringify(headCount(data.basket)));
                    // } else if (data.status === 'deleteorder') {
                    //     console.log('je passe dans elseif : ', data)
                    //     setproductList(data.basket);
                    //     settotalCart(data.totalCart);
                    //     settotalProdQty(headCount(data.basket));
                    //     props.newBasket(data.basket);
                    //     props.newCount(headCount(data.basket));
                    //     localStorage.setItem('count', JSON.stringify(headCount(data.basket)));
                    //     localStorage.removeItem('order');
                } else {
                    console.log('error')
                    //CREER UN MESSAGE DERREUR

                }
            });

    }

    // mettre a jour la quantité d'un article
    let updateQty = async (qty, id, size) => {
        console.log(qty, id, size)
        let url = `/update-qty-to-order`
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `orderID=${orderID}&_id=${id}&qty=${qty}&size=${size}`
        })
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    //settotalCart(data.totalCart);
                    console.log('je verifie que mes prix concordent ici le retour du back : ', data)
                    setproductList(data.basket);
                    settotalCart(data.totalCart);
                    settotalProdQty(headCount(data.basket));
                    props.newBasket(data.basket);
                    props.newCount(headCount(data.basket));

                    localStorage.setItem('count', JSON.stringify(headCount(data.basket)));
                } else {
                    setproductList([])
                    console.log('error')

                    //CREER UN MESSAGE DERREUR
                }
            });

    }

    var prodList = productList.map((product, i) => {

        return (
            <div className='productsCart' key={i}>
                <div className='productsCartPicTitle'>
                    <img className="collecPic cartPic" src={product.img} />

                    <h5 className='productsNameCart'>{product.name}</h5>
                </div>
                <div className='productsCartSub'>
                    <div>
                        <h5 className='productsDetailL'>Price :</h5>
                        <h5 className='productsDetailR'>{product.price / product.quantity}€</h5>
                    </div>
                    <div>
                        <h5 className='productsDetailL'>Size :</h5>
                        <h5 className='productsDetailR'>{product.size}</h5>
                    </div>
                    <div className='productsQty'>
                        <h5 className='productsDetailL'>Quantity :</h5>
                        <div className='productsDetailRQty'>
                            <FontAwesomeIcon
                                icon={faMinus} className='qty-btn less' onClick={(e) => updateQty("less", product._id, product.size)} />
                            <h5 className='productsDetailQty'>{product.quantity} </h5>
                            <FontAwesomeIcon
                                icon={faPlus} className='qty-btn add' onClick={(e) => updateQty("add", product._id, product.size)} />
                        </div>
                    </div>

                </div>

                <h5 className='productsTotalPrice'>Total : {product.price}€</h5>
                <i class="far fa-trash-alt"></i>
                <FontAwesomeIcon className='delete-btn'
                    icon={faTrashAlt}
                    onClick={(e) => deleteproduct(product._id)}
                    value={product._id} />
                {/* <button className='delete-btn'
                    onClick={(e) => deleteproduct(e.target.value)}
                    value={product._id}>Delete Article</button> */}
            </div >
        )

    });

    if (productList.length > 0) {
        return (
            <div className="Cart content">
                <div className="blocCart">
                    {prodList}
                    {/* <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <h5>{totalProdQty} items</h5>
                        <h3>Total : {totalCart}€</h3>
                    </div> */}
                </div >
                <div className="totalCart" style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <h5 className="marg">SHOPPING BAG TOTAL ({totalProdQty} items)</h5>
                    {checkIfExist(userID) ? null :
                        <div>
                            <h5 className="marg">Log in to order with your account</h5>
                            <Link to="/login" className="cartLink">
                                <button className="btnCart" >SIGN IN</button>
                            </Link>
                        </div>
                    }
                    <div className="totalCartElments">
                        <div className="totalCartElmt L">
                            <h5 className="marg" >Order value :</h5>
                            <h5 className="marg" >Shipping :</h5>
                            <h5 className="marg" >TOTAL :</h5>
                        </div>
                        <div className="totalCartElmt R">
                            <h5 className="marg" >{auMillieme(totalCart)}€</h5>
                            <h5 className="marg" >FREE</h5>
                            <h5 className="marg" >{auMillieme(totalCart)}€</h5>
                        </div>
                    </div>
                    <Link to={(checkIfExist(userID) || checkIfExist(guestID)) ? "/payment" : "/checkout"} className="cartLink">
                        <button className="btnCart checkBtn">CONTINUE TO CHECKOUT</button>
                    </Link>
                </div>
            </div >
        );
    } else {
        return (
            <div className='content' style={{ flexDirection: 'column', margin: 20 }}>
                <h3 className='emptyCart'>YOUR SHOPPING BAG IS EMPTY!<br></br><br></br>
                    Sign in to save or access saved items in your shopping bag.</h3>
                <Link to="/signin">
                    <h3 style={{ margin: 20 }} >Sign In</h3>
                </Link>
                <img className="emptyCartPic" src='homepic.png' />
            </div >
        )
    }

};

function mapDispatchToProps(dispatch) {
    return {
        //   newUser: function (userToSend) {
        //     console.log('je suis dans le NEW USER REDUCER', userToSend)
        //     dispatch({ type: 'setUser', user: userToSend })
        //   },
        newCount: function (countToSend) {
            console.log('je suis dans le NEW COUNT REDUCER', countToSend)
            dispatch({ type: 'setCount', count: countToSend })
        },
        newBasket: function (basketToSend) {
            console.log('je suis dans le NEW BASKET REDUCERS', basketToSend)
            dispatch({ type: 'updateBasket', basket: basketToSend })
        },
        // newOrder: function (orderToSend) {
        //     console.log('je suis dans le NEW ORDER REDUCER', orderToSend)
        //     dispatch({ type: 'setOrder', order: orderToSend })
        // }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
//export default Cart;