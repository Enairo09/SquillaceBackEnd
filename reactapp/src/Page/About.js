
import React, { useState, useEffect } from 'react';

const About = (props) => {

    // const [picList, setpicList] = useState([
    //     'homepic.png', 'homepic1.png', 'homepic2.png', 'homepic3.png', 'homepic4.png', 'homepic5.png', 'homepic6.png', 'homepic7.png', 'homepic8.jpg', 'homepic9.jpg', 'homepic10.jpg'
    // ]);

    // const [count, setcount] = useState(0);

    // var nextPic = (arg) => {
    //     if (count <= (picList.length - 2)) {
    //         setcount(count + 1)
    //     } else {
    //         setcount(0);
    //     }
    // }
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="about content">
            <div className="aboutSub">
                <img className="aboutPic" src="martina.jpg" alt='' />
            </div>
            <div className="aboutSub">
                <h5 className="aboutText">
                    Martina Squillace is an Italian Art Director and Stylist based in Paris.<br /><br />

                    After her fashion design studies she has worked with numerous brands troughtout design and commercial departements, where she learned the importance of visual communication, which has become her passion and her work through styling and art direction.<br /><br />

                    Her style, which is characterized by a savage instinct and also an elegant attitude, is the result of continuous cultural and spiritual research.
                </h5>
            </div>
        </div>

    );

};

export default About;


