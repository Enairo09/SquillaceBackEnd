import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const PopUpRetrievePassSent = (props) => {
    const [toShop, settoShop] = useState(false);
    const [toCart, settoCart] = useState(false);

    if (toShop) {
        return (
            <Redirect to={props.link} />
        );

    } else {
        return (
            <div className='popup'>
                <div className='popupinner'>
                    <div className="popupmsg" style={{ display: "flex" }}>
                        <FontAwesomeIcon className="fa-2x icon" icon={faPaperPlane} />
                        <p>{props.content}</p>
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

export default PopUpRetrievePassSent;