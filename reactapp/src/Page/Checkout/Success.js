import React, { useState, useEffect } from 'react';
//import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import useLocalStorage from '../../Functions/useLocalStore';
import checkIfExist from '../../Functions/checkIfExist';

const Success = (props) => {
    const [userID, setuserID] = useLocalStorage('user', '');

    if (checkIfExist(userID)) {
        return (

            <div className='content'>
                <form className="form logoutBloc">
                    <h2>Congrats ! You're purchase is now on the way !</h2>
                    <Link to='/products'>Back to Shopping</Link>
                    <Link to='/myaccount'>See my order</Link>
                    <img className="slide logout" id='homeSlide0' src='home/homepic1.jpg'></img>
                </form>
            </div>
        );
    } else {
        return (

            <div className='content'>
                <form className="form logoutBloc">
                    <h2>Congrats ! You're purchase is now on the way !</h2>
                    <Link to='/products'>Back to Shopping</Link>
                    <Link to='/signin'>Create an account</Link>
                    <img className="slide logout" id='homeSlide0' src='home/homepic1.jpg'></img>
                </form>
            </div>
        );
    }


}

function mapDispatchToProps(dispatch) {
    return {
        newUser: function (userToSend) {
            console.log('je suis dans le NEW USER REDUCER', userToSend)
            dispatch({ type: 'setUser', user: userToSend })
        },
    }
}

export default connect(null, mapDispatchToProps)(Success);