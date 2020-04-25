import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const PopUpMsg = (props) => {
    const [toShop, settoShop] = useState(false);
    const [toCart, settoCart] = useState(false);

    if (toShop) {
        return (
            <Redirect to='/' />
        );
        // } else if (toCart) {
        //     return (
        //         <Redirect to='/cart' />
        //     );
    } else {
        return (
            <div className='popup'>
                <div className='popupinner'>
                    <div className="popupmsg" style={{ display: "flex" }}>
                        <FontAwesomeIcon className="fa-2x icon" icon={faPaperPlane} />
                        <p>Thank You ! We will answer you shortly</p>
                        <FontAwesomeIcon className="fa-2x icon" icon={faPaperPlane} />
                    </div>
                    <div>
                        <button className="checkInOut" onClick={() => { settoShop(true) }}>OK</button>
                        {/* <button className="checkInOut" onClick={() => { settoCart(true) }}>CHECKOUT</button> */}
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
export default PopUpMsg;