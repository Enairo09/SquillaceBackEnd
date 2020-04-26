import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { set } from 'mongoose';
import { faShower } from '@fortawesome/fontawesome-free-solid';

const CollecSlide = (props) => {

    const [fw19picList, setfw19picList] = useState([
        "fw19/1.jpg", "fw19/2.jpg", "fw19/3.jpg", "fw19/4.jpg", "fw19/5.jpg", "fw19/6.jpg", "fw19/7.jpg", "fw19/8.jpg", "fw19/9.jpg", "fw19/10.jpg", "fw19/11.jpg", "fw19/12.jpg", "fw19/13.jpg", "fw19/14.jpg", "fw19/15.jpg", "fw19/16.jpg"
    ]);
    const [ss20picList, setss20picList] = useState([
        "ss20/1.jpg", "ss20/2.jpg", "ss20/3.jpg", "ss20/4.jpg", "ss20/5.jpg", "ss20/6.jpg", "ss20/7.jpg", "ss20/8.jpg", "ss20/9.jpg", "ss20/10.jpg", "ss20/11.jpg", "ss20/12.jpg", "ss20/13.jpg", "ss20/14.jpg", "ss20/15.jpg", "ss20/16.jpg"
    ]);
    const [count, setcount] = useState(props.collectionToShowValue);
    const prevRef = useRef();
    useEffect(() => {
        prevRef.current = count;
    });

    let listToCheck = props.collectionToShowID === "fw19" ? fw19picList : ss20picList

    const handleUserKeyPress = useCallback(event => {
        const { key, keyCode } = event;
        if (key === "ArrowRight") {
            if (prevRef.current < listToCheck.length - 1) {
                setcount(prevRef.current + 1);
            } else {
                setcount(0);
            }
        } else if (key === "ArrowLeft") {
            if (prevRef.current !== 0) {
                setcount(prevRef.current - 1);
            } else {
                setcount(listToCheck.length - 1);
            }
        } else if (key === "Escape") {
            props.setshow(false)
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleUserKeyPress);
        return () => {
            window.removeEventListener('keydown', handleUserKeyPress);
        };
    }, []);

    let goNext = () => {
        if (count < listToCheck.length - 1) {
            setcount(count + 1);
        } else {
            setcount(0);
        }
    };
    let goBack = () => {
        if (count !== 0) {
            setcount(count - 1);
        } else {
            setcount(listToCheck.length - 1);
        }
    };

    //const func = (event) => console.log('move', event.type, event.movementX);

    return (


        <div className='popupcollec' >
            <div className='popupinnercollec'>
                {props.collectionToShowID === "fw19" ?
                    <div>
                        <FontAwesomeIcon className="fa-2x closeIcone" icon={faTimes} onClick={(e) => props.setshow(false)} />
                        <FontAwesomeIcon className="fa-2x leftIcone" icon={faChevronLeft} onClick={(e) => goBack()} />
                        <FontAwesomeIcon className="fa-2x rightIcone" icon={faChevronRight} onClick={(e) => goNext()} />
                        <img className="slidecollec" src={fw19picList[count]} alt="img1" onClick={(e) => goNext()} />
                    </div>
                    : props.collectionToShowID === "ss20" ?
                        <div>
                            <FontAwesomeIcon className="fa-2x closeIcone" icon={faTimes} onClick={(e) => props.setshow(false)} />
                            <FontAwesomeIcon className="fa-2x leftIcone" icon={faChevronLeft} onClick={(e) => goBack()} />
                            <FontAwesomeIcon className="fa-2x rightIcone" icon={faChevronRight} onClick={(e) => goNext()} />
                            <img className="slidecollec" src={ss20picList[count]} alt="img1"
                                //onMouseMove={func}
                                onClick={(e) => goNext()} />
                        </div>
                        : null}


            </div>
        </div>
    )
}

export default CollecSlide;