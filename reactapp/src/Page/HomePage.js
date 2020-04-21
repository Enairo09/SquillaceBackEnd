import React, { useState } from 'react';
import { connect } from 'react-redux';
// import { useMediaQuery } from 'react-responsive';

function mapStateToProps(state) {
    console.log('home page get user HOME', state)
    return { userName: state.user }
}
const HomePage = (props) => {

    const [picList, setpicList] = useState([
        'homepic.png', 'homepic1.png', 'homepic2.png', 'homepic3.png', 'homepic4.png', 'homepic5.png', 'homepic6.png', 'homepic7.png', 'homepic8.jpg', 'homepic9.jpg', 'homepic10.jpg'
    ]);

    const [count, setcount] = useState(0);
    // const isDesktopOrLaptop = useMediaQuery({ minDeviceWidth: 1224 })
    // const isBigScreen = useMediaQuery({ minDeviceWidth: 1824 })
    // const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 })
    // const isTabletOrMobileDevice = useMediaQuery({ maxDeviceWidth: 1224 })
    // const isPortrait = useMediaQuery({ orientation: 'portrait' })
    // const isRetina = useMediaQuery({ minResolution: '2dppx' })
    //je passe les photos
    var nextPic = (arg) => {
        if (count <= (picList.length - 2)) {
            setcount(count + 1)
        } else {
            setcount(0);
        }
    }

    var prevPic = (arg) => {
        if (count > 1) {
            setcount(count - 1)
        } else {
            setcount((picList.length - 1))
        }
    }

    return (
        <div style={{ paddingTop: 90 }}>
            <div className='slideshow'  >
                <div className="testSlideLeft" onClick={(e) => { prevPic(e.target.value) }}> </div>
                <div className="testSlideRight" onClick={(e) => { nextPic(e.target.value) }}> </div>
                <img className="slide" id='homeSlide0' src={picList[count]}></img>
            </div>

            <div className="footer">
                <a href="https://www.facebook.com/martina.squillacedesigner" target="_blanck" alt=''>
                    <img src="logofbk.png" className="socMedia" alt='' />
                </a>
                <a href="https://www.pinterest.it/martinasquillac/" target="_blanck" alt=''>
                    <img src="logopinterest.png" className="socMedia" alt='' />
                </a>
                <a href="https://www.instagram.com/martinasquillace/?hl=fr" target="_blanck" alt=''>
                    <img src="logoinsta.png" className="socMedia" alt='' />
                </a>
                <a href="http://www.martinasquillace.com/" target="_blanck" alt=''>
                    <img src="logomail.png" className="socMedia" alt='' />
                </a>
            </div>
        </div >
    );

};

export default connect(mapStateToProps, null)(HomePage);

