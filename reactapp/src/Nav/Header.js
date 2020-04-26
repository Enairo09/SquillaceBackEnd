import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/fontawesome-free-solid';
import { faMitten, faTimes, faShoppingBag } from '@fortawesome/free-solid-svg-icons'
import checkIfExist from '../Functions/checkIfExist';


function mapStateToProps(state) {
    //console.log('home page get user', state)
    return { userName: state.user }
}

const Header = (props) => {
    const [isExpanded, setisExpanded] = useState(false);
    const [signModal, setsignModal] = useState(false);
    const [count, setcount] = useState(0);
    const [user, setuser] = useState('');
    const [active, setactive] = useState('');


    useEffect(() => {
        let tempUser = JSON.parse(window.localStorage.getItem('user'));
        console.log('user ==========', JSON.parse(window.localStorage.getItem('user')))
        let urlCurrent = window.location.href
        let url = urlCurrent.split("/")
        setactive(url[3])
        console.log("url", urlCurrent.split("/"))

        if (tempUser != null) {
            setuser(tempUser);
        }
    }, []);

    let handleToggle = (e) => {
        e.preventDefault();
        setisExpanded(!isExpanded);

    }

    let signInUp = (e) => {
        setsignModal(!signModal);
    }

    return (
        <header className='header'>
            <div className='title'>
                <Link to="/" exact onClick={(e) => setactive('')}>
                    <img className="logo" src='/logo.png' />
                    {/* <h2>Martina Squillace</h2> */}
                </Link>
            </div>
            <div className="linksWeb">
                <ul className='lienweb'>
                    {/* <FontAwesomeIcon className="linksPhone" icon={faMitten} /> */}
                    <li className="linkHeader" ><Link to="/about" className={active === "about" ? "active" : null} onClick={(e) => setactive('about')}>About </Link></li>
                    <li className="linkHeader"
                    //onClick={e => signInUp(e)}
                    ><Link className={active === "collection" ? "active" : null} to='/collection' onClick={(e) => setactive('collection')}>Collection</Link></li>
                    {/* <span className={`${signModal ? "signModal" : "collapsedModal"}`} onMouseLeave={e => signInUp(e)}>
                        <li className="linkHeader" onClick={e => signInUp(e)}><Link>Collection</Link></li>
                        <Link to="/myaccount" style={{ fontSize: 12 }}>Spring/Summer 20</Link>
                        <Link to="/myaccount" style={{ fontSize: 12 }}>Fall/Winter 19</Link>
                    </span> */}
                    <li className="linkHeader" ><Link className={active === "products" ? "active" : null} to="/products" onClick={(e) => setactive('products')}>Shop</Link></li>
                    <li className="linkHeader" ><Link className={active === "contact" ? "active" : null} to="/contact" onClick={(e) => setactive('contact')}>Contact</Link></li>
                    {props.user ?
                        <span className="linkHeader">
                            <li className="linkHeader" >
                                <Link to="/myaccount" className={active === "myaccount" ? "active" : null} onClick={(e) => setactive('myaccount')}>My Account</Link></li>
                        </span>
                        :
                        <li className="linkHeader" ><Link className={active === "signin" ? "active" : null} to="/signin" onClick={(e) => setactive('signin')}>Sign In</Link></li>}
                    {/* <li className="linkHeader" ><Link to="/signout">My Account</Link></li> */}
                    {/* <span className="linkHeader" >
                            <li className="linkHeader" onMouseOver={e => signInUp(e)} >My Account</li>
                            <span className={`${signModal ? "signModal" : "collapsedModal"}`} onMouseLeave={e => signInUp(e)}>
                                <Link to="/myaccount" style={{ fontSize: 12 }}>My Account</Link>
                                <Link to="/myaccount" style={{ fontSize: 12 }}>Wishlist</Link>
                                <Link to="/signout" style={{ fontSize: 12 }}>Log Out</Link>
                            </span>
                        </span> */}

                    <li className="linkHeader" onClick={e => handleToggle(e)}>
                        <Link to="/cart" className={active === "cart" ? "active" : null} onClick={(e) => setactive('cart')}>
                            <FontAwesomeIcon icon={faShoppingBag} /> ({props.count})
                        </Link>
                    </li>
                    {/* <Link to="/form">
                        <h2>Ajouter des Produits</h2>
                    </Link> */}
                </ul>
            </div>
            <nav className="linksMobil" >
                {!isExpanded ? <FontAwesomeIcon icon={faBars}
                    className="fa-2x menuToogle"
                    onClick={e => handleToggle(e)}
                /> : null}
                {/* <img src="fabar.png"
                        className="menuToogle"
                        onClick={e => handleToggle(e)}
                    />class="fa fa-circle fa-stack-2x" */}
                {isExpanded ? <FontAwesomeIcon icon={faTimes}
                    className="fa-2x menuToogle"
                    onClick={e => handleToggle(e)}
                /> : null}
                {isExpanded ?
                    <ul className="is-expanded">
                        <li className="linkHeader" onClick={e => handleToggle(e)}><Link to="/about">About </Link></li>
                        <li className="linkHeader" onClick={e => handleToggle(e)}><Link to="/collection">Collection</Link></li>
                        <li className="linkHeader" onClick={e => handleToggle(e)}><Link to="/products">Shop</Link></li>
                        <li className="linkHeader" onClick={e => handleToggle(e)}><Link to="/contact">Contact</Link></li>
                        {props.user ?
                            <li className="linkHeader" onClick={e => handleToggle(e)}><Link to="/myaccount">My Account</Link></li>
                            :
                            <li className="linkHeader" ><Link to="/signin">Sign In</Link></li>}
                        {/* <li className="linkHeader" onMouseOver={e => signInUp(e)} >My Account</li>
                        <span className={`${signModal ? "signModal" : "collapsedModal"}`} onMouseLeave={e => signInUp(e)}>
                            <Link to="/myaccount">My Account</Link>
                            <Link to="/signout" style={{ fontSize: 12 }}>Log Out</Link>
                        </span> */}
                        <li className="linkHeader" onClick={e => handleToggle(e)}>
                            <Link to="/cart">
                                <FontAwesomeIcon icon={faShoppingBag} /> ({props.count})
                        </Link>
                        </li>

                    </ul> : null}
            </nav>
        </header >
    )

}

export default connect(mapStateToProps, null)(Header);