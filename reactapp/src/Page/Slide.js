import React, { useState, useEffect } from 'react';
import { Slide, slideRef } from 'react-slideshow-image';
// import img1 from "../../public/homepic.jpg";
// import img2 from "../../public/homepic1.jpg";
// import img3 from "../../public/homepic2.jpg";
const proprietes = {
    duration: 5000,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: true
}

const Slideshow = () => {
    const [picList, setpicList] = useState([
        'homepic.png', 'homepic1.jpg', 'homepic2.jpg', 'homepic3.jpg', 'homepic4.jpg', 'homepic5.jpg', 'homepic6.jpg',
        //'homepic7.jpg', 'homepic8.jpg',
        //'homepic9.jpg', 'homepic10.jpg'
    ]);

    var slideList = picList.map((imgSource, i) => {

        return (
            <div className="each-slide">
                <div className="containerSlide">
                    {/* <div className="testSlideLeft" onClick={(e) => { e.slideRef.goBack() }}> </div>
                    <div className="testSlideRight" onClick={(e) => { e.slideRef.goNext() }}> </div> */}
                    <img className="slide" src={`home/${imgSource}`} alt="img1" />
                </div>
            </div>
        )
    })

    return (
        <div >

            <Slide {...proprietes} >
                {slideList}
            </Slide>
        </div>
    )
}

export default Slideshow;