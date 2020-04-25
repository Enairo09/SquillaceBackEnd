import React, { useState, useEffect } from 'react';
//import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


const Logout = (props) => {

    useEffect(() => {
        props.newUser('')
        window.localStorage.removeItem('user');
    })

    return (

        <div className='content'>
            <form className="form logoutBloc">
                <h2>You're logged Out !</h2>
                <Link to='/products'>Back to Shopping</Link>
                <img className="slide logout" id='homeSlide0' src='home/homepic1.jpg'></img>
            </form>
        </div>
    );

}

function mapDispatchToProps(dispatch) {
    return {
        newUser: function (userToSend) {
            console.log('je suis dans le NEW USER REDUCER', userToSend)
            dispatch({ type: 'setUser', user: userToSend })
        },
    }
}

export default connect(null, mapDispatchToProps)(Logout);