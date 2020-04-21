import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const PopUp = (props) => {
    const [toShop, settoShop] = useState(false);
    const [toCart, settoCart] = useState(false);

    if (toShop) {
        return (
            <Redirect to='/products' />
        );
    } else if (toCart) {
        return (
            <Redirect to='/cart' />
        );
    } else {
        return (
            <div className='popup'>
                <div className='popupinner'>
                    <h4>{props.text}</h4>
                    <p>was successfully added to your shopping cart</p>
                    <div>
                        <button className="checkInOut" onClick={() => { settoShop(true) }}>CONTINUE SHOPPING</button>
                        <button className="checkInOut" onClick={() => { settoCart(true) }}>CHECKOUT</button>
                    </div>
                </div>
            </div>

        );
    }
};

// function mapStateToProps(state) {
// 	return { user: state.user };
// }
//export default connect(mapStateToProps, null)(Conversation);
export default PopUp;