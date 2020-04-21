import React, { useState, useEffect } from 'react';
import Popup from '../../Components/PopUpAddProduct';
// import { Redirect } from 'react-router-dom';
// import Change from '../Change';
import { connect } from 'react-redux';
import useLocalStorage from '../../Functions/useLocalStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/fontawesome-free-solid';
import checkIfExist from '../../Functions/checkIfExist';
import headCount from '../../Functions/headCount';

// function mapStateToProps(state) {
//     console.log('shop page get store', state)
//     return { orderID: state.orderID }
// }

const ProductCard = (props) => {

    const [userID, setuserID] = useLocalStorage('user', []);
    const [orderID, setorderID] = useLocalStorage('order', '');
    //const [orderID, setorderID] = useState(props.orderID);

    const [product, setproduct] = useState({
        id: '',
        name: '',
        price: 0,
        type: '',
        img: '',
    });
    const [currentBasket, setcurrentBasket] = useState([]);

    const [productToBasket, setproductToBasket] = useState({

        productID: '',
        name: '',
        price: 0,
        type: '',
        img: '',
        quantity: 1,
        size: ''
    });
    const [showPopup, setshowPopup] = useState(false);

    //je recupere mon produit
    useEffect(() => {
        // for (var i = 0; i > props.basket.length; i++) {
        //     setcurrentBasket([...currentBasket, props.basket[i]]);
        //     console.log("update etat store", currentBasket)
        // }
        //setcurrentBasket(JSON.parse(window.localStorage.getItem('order')));

        // props.newOrder(orderID)
        const fetchData = async () => {

            let url = `/get-one-product`
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `id=${props.match.params.id}&orderID=${orderID}`
            })
                .then(response => response.json())
                .then(data => {
                    console.log('retour de get one', data)
                    setproduct({ productID: data.products._id, name: data.products.name, price: data.products.price, type: data.products.type, img: data.products.img })
                    setproductToBasket({ ...productToBasket, productID: data.products._id, name: data.products.name, type: data.products.type, img: data.products.img, price: data.products.price })
                    if (data.orderID === null) {
                        setcurrentBasket(null);
                    } else {
                        console.log('ce que jenregistre comme panier en cours', data.basket)
                        //await localStorage.setItem('order', JSON.stringify(data.orderID));
                        setcurrentBasket(data.basket);
                    }
                })
                .catch(error => console.log("erreur fetch", error));
        }
        fetchData();

    }, []);

    var addProduct = async (e) => {
        e.preventDefault();

        if (checkIfExist(currentBasket)) {
            //j'ai un panier en cours, j'udpate la quantité et le prix de mon product ==== UPDATE ORDER
            let url = '/add-product-to-order';
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `id=${userID}&orderID=${orderID}&tempStore=${JSON.stringify(productToBasket)}`
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('retour du back === ', data)
                    if (data.status) {

                        //await localStorage.setItem('user', JSON.stringify(data.id));
                        localStorage.setItem('order', JSON.stringify(data.orderID));
                        localStorage.setItem('count', JSON.stringify(headCount(data.basket)));
                        //props.newUser(data.id);
                        props.newOrder(data.orderID);
                        props.newBasket(data.basket);
                        props.newCount(headCount(data.basket));

                        //localStorage.setItem('order', JSON.stringify(data.orderID));
                        setshowPopup(!showPopup);
                    } else {
                        //CREER UN MESSAGE DERREUR
                        console.log('erreur')
                    }
                });

        } else {
            //je crée un order =========== CREATE NEW ORDER
            let url = '/createorder';
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `id=${userID}&productID=${productToBasket.productID}&name=${productToBasket.name}&price=${productToBasket.price}&type=${productToBasket.type}&img=${productToBasket.img}&quantity=${productToBasket.quantity}&size=${productToBasket.size}`
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('retour du back === ', data.status)
                    if (data.status) {
                        const update = async () => {
                            //await localStorage.setItem('user', JSON.stringify(data.id));
                            await localStorage.setItem('order', JSON.stringify(data.orderID));
                            await localStorage.setItem('count', JSON.stringify(headCount(data.basket)));
                            // props.newUser(data.id);
                            await props.newOrder(data.orderID);
                            await props.newBasket(data.basket);
                            await props.newCount(headCount(data.basket));
                            setshowPopup(!showPopup);
                        }
                        update();

                    } else {
                        //CREER UN MESSAGE DERREUR
                        console.log('erreur')
                    }
                });
        }
    };

    return (
        <div className='content'>
            <a href='/products' className="backToSearch">
                <FontAwesomeIcon className="backArrow" icon={faArrowLeft} />
                <h5 className="backCollec" >Back to Collection</h5>
            </a>

            <div className="productCard">

                <img className='productsPic' src={`/${product.img}`} />
                {showPopup ?
                    <Popup
                        text={product.name}
                    />
                    : null
                }
                {/* {showPopupFail.show ?
                    <PopUpFail
                        field={showPopupFail.field}
                    />
                    : null
                } */}
                <div className='productsText'>
                    <h3>{product.name}</h3>
                    <div>
                        <h5>{product.price}€</h5>
                        <h5>{product.type}</h5>
                        <form onSubmit={(e) => addProduct(e)} value="Add to cart">
                            <label className='sizeInput'>Size : </label>
                            <select
                                onChange={(e) => setproductToBasket({ ...productToBasket, size: e.target.value })} required>
                                <option value="">--</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                            </select>
                            {/* <label>Quantity :</label> */}
                            {/* <input className='inputCard' type='hidden' min="0" placeholder='1'
                                onSubmit={(e) => {
                                    console.log(e.target.value);
                                    setproductToBasket({ ...productToBasket, quantity: parseFloat(e.target.value), price: auMillieme(e.target.value * product.price) })
                                }}
                                value="1" required></input> */}
                            <input type="submit" className='add-btn' />
                        </form>
                    </div>

                </div >
            </div >
        </div>
    );

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
        newOrder: function (orderToSend) {
            console.log('je suis dans le NEW ORDER REDUCER', orderToSend)
            dispatch({ type: 'setOrder', order: orderToSend })
        }
    }
}
export default connect(null, mapDispatchToProps)(ProductCard);
//export default ProductCard;
