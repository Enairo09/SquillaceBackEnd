import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { set } from 'mongoose';
import { faShower } from '@fortawesome/fontawesome-free-solid';

const ProductSlide = (props) => {

    const [picList, setpicList] = useState(props.arrayToDisplay);
    const [hideArrow, sethideArrow] = useState(false);
    const [count, setcount] = useState(props.collectionToShowID);
    const prevRef = useRef();
    useEffect(() => {
        prevRef.current = count;
    });

    const handleUserKeyPress = useCallback(event => {
        const { key, keyCode } = event;
        if (key === "ArrowRight") {
            if (prevRef.current < picList.length - 1) {
                setcount(prevRef.current + 1);
            } else {
                setcount(0);
            }
        } else if (key === "ArrowLeft") {
            if (prevRef.current !== 0) {
                setcount(prevRef.current - 1);
            } else {
                setcount(picList.length - 1);
            }
        } else if (key === "Escape") {
            props.setshow(false)
        }
    }, []);

    useEffect(() => {

        window.scrollTo(0, 0);

        if (picList.length === 1) {
            sethideArrow(true)
        }
        document.addEventListener('keydown', handleUserKeyPress);
        return () => {
            window.removeEventListener('keydown', handleUserKeyPress);
        };
    }, []);

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

        // <div className='popupprod'>
        <div className='popupprod'>
            <div>
                <FontAwesomeIcon className="fa-2x closeIconeProd" icon={faTimes} onClick={(e) => props.setshow(false)} />
                {hideArrow ? null : <FontAwesomeIcon className="fa-2x leftIconeProd" icon={faChevronLeft} onClick={(e) => goBack()} />}
                {hideArrow ? null : <FontAwesomeIcon className="fa-2x rightIconeProd" icon={faChevronRight} onClick={(e) => goNext()} />}
                <img className="slideproduct" src={`/${picList[count].ref}`} alt="img1" onClick={(e) => props.setshow(false)} />
            </div>
        </div>
        // </div>
    )
}

export default ProductSlide;