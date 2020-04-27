import React, { useState, useEffect } from 'react';
import Popup from '../../Components/PopUpAddProduct';
// import { Redirect } from 'react-router-dom';
// import Change from '../Change';
import { connect } from 'react-redux';
import useLocalStorage from '../../Functions/useLocalStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/fontawesome-free-solid';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import checkIfExist from '../../Functions/checkIfExist';
import headCount from '../../Functions/headCount';
import ProductSlide from './ProductSlide';
//import { Slide, slideRef } from 'react-slideshow-image';
// const proprietes = {
//     duration: 10000,
//     transitionDuration: 500,
//     infinite: true,
//     indicators: true,
//     // arrows: true
// }

// function mapStateToProps(state) {
//     console.log('shop page get store', state)
//     return { orderID: state.orderID }
// }

const ProductCard = (props) => {

    const [userID, setuserID] = useLocalStorage('user', []);
    const [orderID, setorderID] = useLocalStorage('order', '');
    const [hideArrow, sethideArrow] = useState(false);

    const [product, setproduct] = useState({
        id: '',
        name: '',
        price: 0,
        type: '',
        img: '',
    });
    const [currentBasket, setcurrentBasket] = useState([]);
    const [count, setcount] = useState(0);
    const [imgToDisplay, setimgToDisplay] = useState([
        { ref: '' }
    ]);
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

    const [fullScreen, setfullScreen] = useState(false)
    const [imgToPass, setimgToPass] = useState('');
    const [smallScreen, setsmallScreen] = useState(false);

    //je recupere mon produit
    useEffect(() => {
        window.scrollTo(0, 0)
        console.log('size screen', window.screen.width)
        if (window.screen.width < 600) {
            setsmallScreen(true)
        }
        // for (var i = 0; i > props.basket.length; i++) {
        //     setcurrentBasket([...currentBasket, props.basket[i]]);
        //     console.log("update etat store", currentBasket)
        // }
        //setcurrentBasket(JSON.parse(window.localStorage.getItem('order')));

        // props.newOrder(orderID)
        const fetchData = async () => {

            let url = `/api/get-one-product`
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `id=${props.match.params.id}&orderID=${orderID}`
            })
                .then(response => response.json())
                .then(data => {
                    console.log('retour de get one', data)
                    // let arrayTemp = data.products.img
                    // let array = arrayTemp.split(' ');
                    setimgToDisplay(data.products.img);
                    if (data.products.img.length === 1) {
                        sethideArrow(true)
                    }
                    // console.log('arary', array)
                    setproduct({ productID: data.products._id, name: data.products.name, price: data.products.price, description: data.products.description, type: data.products.type, img: data.products.img })
                    setproductToBasket({ ...productToBasket, productID: data.products._id, name: data.products.name, type: data.products.type, description: data.products.description, img: data.products.img[0].ref, price: data.products.price })
                    if (data.orderID === null) {
                        console.log('test', imgToDisplay[count])

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
            let url = '/api/add-product-to-order';
            console.log('click')
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
            let url = '/api/createorder';
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

    let goNext = () => {
        if (count < imgToDisplay.length - 1) {
            setcount(count + 1);
        } else {
            setcount(0);
        }
    }
    let goBack = () => {
        if (count !== 0) {
            setcount(count - 1);
        } else {
            setcount(imgToDisplay.length - 1);
        }
    }

    let showFullScreen = (id) => {
        setimgToPass(id);
        setfullScreen(true);
    }

    // var slideList = imgToDisplay.map((imgSource, i) => {

    //     return (


    //         <img className="productsPic" src={`/${imgSource.ref}`} alt="img1" onClick={(e) => showFullScreen(i)} />


    //         //      <div className="each-slide">
    //         //      <div >
    //         //          {/* <div className="testSlideLeft" onClick={(e) => { e.slideRef.goBack() }}> </div>
    //         //          <div className="testSlideRight" onClick={(e) => { e.slideRef.goNext() }}> </div> */}
    //         //          <img className="productsPic" src={`/${imgSource}`} alt="img1" />
    //         //      </div>
    //         //  </div>
    //     )
    // })

    return (
        <div className='content'>
            {fullScreen ? <ProductSlide
                //className="hideOnPhone" 
                collectionToShowID={count} setshow={setfullScreen} arrayToDisplay={imgToDisplay} /> : null}

            <a href='/products' className="backToSearch">
                <FontAwesomeIcon className="backArrow" icon={faArrowLeft} />
                <h5 className="backCollec" >Back to Collection</h5>
            </a>

            <div className="productCard">
                {hideArrow ? null : <FontAwesomeIcon className="fa-2x leftProdCard" icon={faChevronLeft} onClick={(e) => goBack()} />}
                <img className='productsPic' src={`/products/${imgToDisplay[count].ref}`} onClick={smallScreen ? (e) => goNext() : (e) => showFullScreen(`/${imgToDisplay[count].ref}`)} />
                {/* {checkIfExist(imgToDisplay[count + 1]) ? <img className='productsPic' src={`/${imgToDisplay[count + 1]}`} /> : null} */}
                {hideArrow ? null : <FontAwesomeIcon className="fa-2x rightProdCard" icon={faChevronRight} onClick={(e) => goNext()} />}
                {/* <Slide {...proprietes} className="productSlide">
                    {slideList}
                </Slide> */}
                {/* <div className="productSlide">
                    {slideList}
                </div> */}
                {showPopup ?
                    <Popup
                        text={product.name}
                    />
                    : null
                }

                <div className='productsText'>
                    <h3>{product.name}</h3>
                    <div>
                        <h5>{product.price}€</h5>
                        <h5>{product.type}</h5>
                        <h5>{product.description}</h5>
                        <form onSubmit={(e) => addProduct(e)} value="Add to cart">
                            <label className='sizeInput'>Size : </label>
                            <select className='sizeInputbis'
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
                            <input type="submit" className='add-btn' value="Add to Cart" />
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
