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


    useEffect(() => {
        let tempUser = JSON.parse(window.localStorage.getItem('user'));
        console.log('user ==========', JSON.parse(window.localStorage.getItem('user')))
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

    if (props.user) {

        //console.log('je verifie mon compteur panier : ', props.count)
        return (
            <header className='header'>
                <div className='title'>
                    <Link to="/" exact>
                        <img className="logo" src='/logo.png' />
                        {/* <h2>Martina Squillace</h2> */}
                    </Link>
                </div>
                <div className="linksWeb">
                    <ul className='lienweb'>
                        {/* <FontAwesomeIcon className="linksPhone" icon={faMitten} /> */}
                        <li className="linkHeader" ><Link to="/about">About </Link></li>
                        <li className="linkHeader" ><Link to="/collection">Collection</Link></li>
                        <li className="linkHeader" ><Link to="/products">Shop</Link></li>
                        <li className="linkHeader" ><Link to="/contact">Contact</Link></li>
                        <span className="linkHeader">
                            <li className="linkHeader" >
                                <Link to="/myaccount">My Account</Link></li>
                        </span>
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
                            <Link to="/cart">
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
                            <li className="linkHeader" onClick={e => handleToggle(e)}><Link to="/myaccount">My Account</Link></li>

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
            </header >)
    } else {
        return (

            // <nav className="nav">
            //     <i
            //         className="fa fa-bars"
            //         aria-hidden="true"
            //         onClick={e => this.handleToggle(e)}
            //     />
            //     <ul className={`collapsed ${isExpanded ? "is-expanded" : ""}`}>
            //         <Link activeClassName="active" to="/">
            //             <li>home</li>
            //         </Link>
            //         <Link activeClassName="active" to="/about">
            //             <li>about</li>
            //         </Link>
            //         <Link activeClassName="active" to="/contact">
            //             <li>contact</li>
            //         </Link>
            //     </ul>
            // </nav>
            < header className='header' >
                <div className='title'>
                    <Link to="/" exact>
                        <img className="logo" src='/logo.png' />
                        {/* <h2>Martina Squillace</h2> */}
                    </Link>
                </div>
                <div className="linksWeb">
                    <ul className='lienweb'>
                        {/* <FontAwesomeIcon className="linksPhone" icon={faMitten} /> */}
                        <li className="linkHeader" ><Link to="/about">About </Link></li>
                        <li className="linkHeader" ><Link to="/collection">Collection</Link></li>
                        <li className="linkHeader" ><Link to="/products">Shop</Link></li>
                        <li className="linkHeader" ><Link to="/contact">Contact</Link></li>
                        <li className="linkHeader" ><Link to="/signin">Sign In</Link></li>
                        {/* <li className="linkHeader" onMouseOver={e => signInUp(e)} >Sign In</li>
                        <span className={`${signModal ? "signModal" : "collapsedModal"}`} onMouseLeave={e => signInUpOUT(e)}>
                            <Link to="/signin">Sign In</Link>
                            <Link to="/signin">My Account</Link>
                        </span> */}
                        <li className="linkHeader" onClick={e => handleToggle(e)}>
                            <Link to="/cart">
                                <FontAwesomeIcon icon={faShoppingBag} /> ({props.count})
                            </Link>
                        </li>
                        {/* <Link to="/form">
                            <h2>Ajouter des Produits</h2>
                        </Link> */}
                    </ul>
                </div>

                <nav className="linksMobil">
                    {!isExpanded ? <FontAwesomeIcon icon={faBars}
                        className="fa-2x menuToogle"
                        onClick={e => handleToggle(e)}
                    /> : null}
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
                            <li className="linkHeader" onClick={e => handleToggle(e)}><Link to="/signin">Sign In</Link></li>

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

}

export default connect(mapStateToProps, null)(Header);