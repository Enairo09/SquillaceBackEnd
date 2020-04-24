import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/fontawesome-free-solid';
import CollecSlide from './CollecSlide';

const Collection = (props) => {
    const [showCollection, setshowCollection] = useState(false)
    const [fullScreen, setfullScreen] = useState(false)
    const [imgToPass, setimgToPass] = useState({
        value: '',
        id: ''
    })

    const [fw19picList, setfw19picList] = useState([
        "fw19/1.jpg", "fw19/2.jpg", "fw19/3.jpg", "fw19/4.jpg", "fw19/5.jpg", "fw19/6.jpg", "fw19/7.jpg", "fw19/8.jpg", "fw19/9.jpg", "fw19/10.jpg", "fw19/11.jpg", "fw19/12.jpg", "fw19/13.jpg", "fw19/14.jpg", "fw19/15.jpg", "fw19/16.jpg"
    ]);
    const [ss20picList, setss20picList] = useState([
        "ss20/1.jpg", "ss20/2.jpg", "ss20/3.jpg", "ss20/4.jpg", "ss20/5.jpg", "ss20/6.jpg", "ss20/7.jpg", "ss20/8.jpg", "ss20/9.jpg", "ss20/10.jpg", "ss20/11.jpg", "ss20/12.jpg", "ss20/13.jpg", "ss20/14.jpg", "ss20/15.jpg", "ss20/16.jpg"
    ]);

    let showFullScreen = (id, value) => {
        console.log(id, value)
        setimgToPass({ value: value, id: id });
        setfullScreen(true);
    }


    let fw19List = fw19picList.map((imgSource, i) => {
        return (
            <img className="collecPic" src={imgSource} alt='' onClick={(e) => showFullScreen("fw19", i)} />
        )
    })

    let ss20List = ss20picList.map((imgSource, i) => {
        return (
            <img className="collecPic" src={imgSource} alt='' onClick={(e) => showFullScreen("ss20", i)} />
        )
    })
    return (
        <div className="collection content">
            <div className="collecSeason">
                <h5 className="season" value="fw19" onClick={(e) => { setshowCollection(true) }}>Fall/Winter 19</h5>
                <FontAwesomeIcon className="season" icon={faBolt} />
                <h5 className="season" value="ss20" onClick={(e) => { setshowCollection(false) }}>Spring/Summer 20</h5>
            </div>

            {showCollection ?
                <div>
                    {fw19List}
                </div>
                : <div>
                    {ss20List}
                </div>}
            {fullScreen ? <CollecSlide collectionToShowID={imgToPass.id} collectionToShowValue={imgToPass.value} setshow={setfullScreen} /> : null}

            {/* <div>
                <img className="collecPic" src="marti1.jpg" alt='' />
                <img className="collecPic" src="marti2.jpg" alt='' />
                <img className="collecPic" src="marti3.jpg" alt='' />
                <img className="collecPic" src="marti4.jpg" alt='' />
                <img className="collecPic" src="marti5.jpg" alt='' />
                <img className="collecPic" src="marti6.jpg" alt='' />
                <img className="collecPic" src="marti7.jpg" alt='' />
                <img className="collecPic" src="marti8.jpg" alt='' />
                <img className="collecPic" src="marti9.jpg" alt='' />
                <img className="collecPic" src="marti10.jpg" alt='' />
                <img className="collecPic" src="marti11.jpg" alt='' />
                <img className="collecPic" src="marti12.jpg" alt='' />
            </div> */}
        </div >

    );

};

export default Collection;


