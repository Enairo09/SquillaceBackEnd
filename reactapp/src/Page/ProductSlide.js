import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { set } from 'mongoose';
import { faShower } from '@fortawesome/fontawesome-free-solid';

const ProductSlide = (props) => {

    const [picList, setpicList] = useState(props.arrayToDisplay);

    const [count, setcount] = useState(props.collectionToShowID);


    let goNext = () => {
        if (count < picList.length - 1) {
            setcount(count + 1);
        } else {
            setcount(0);
        }
    }
    let goBack = () => {
        if (count !== 0) {
            setcount(count - 1);
        } else {
            setcount(picList.length - 1);
        }
    }

    return (


        <div className='popupprod'>
            <div>
                <FontAwesomeIcon className="fa-2x closeIcone" icon={faTimes} onClick={(e) => props.setshow(false)} />
                <FontAwesomeIcon className="fa-2x leftIcone" icon={faChevronLeft} onClick={(e) => goBack()} />
                <FontAwesomeIcon className="fa-2x rightIcone" icon={faChevronRight} onClick={(e) => goNext()} />
                <img className="slideproduct" src={`/${picList[count]}`} alt="img1" onClick={(e) => goNext()} />
            </div>
        </div>
    )
}

export default ProductSlide;