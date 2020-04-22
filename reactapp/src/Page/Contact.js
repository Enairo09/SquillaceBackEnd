import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

const Contact = () => {

    const [form, setform] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [msgSend, setmsgSend] = useState(false);

    var handleForm = (e) => {
        e.preventDefault();
        // if (form.name === '' || form.email === '' || form.message === '') {
        //     setshowPopupFail({ show: true, field: 'contact' })
        // } else {
        console.log('envoi formulaire', form);
        fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `name=${form.name}&email=${form.email}&message=${form.message}`
        }).then(function (data) { console.log('this message is saved', data); setmsgSend(true) }).catch(function (error) { console.log('error', error) });
        // }
        // //<input type='button' onclick="self.location.href='mailto:moi@chezmoi.ici'" value="vas y envoie toi un mail avec ta messagerie" />
    }
    if (msgSend) {
        return <Redirect to="/" />
    } else {
        return (
            <div className='content'>
                <div className="contactTitle" style={{ height: 60 }}>
                    <h3 style={{ fontSize: 20, marginLeft: 20 }}>Contact Us</h3>
                </div>
                <div className="contactBloc">
                    <img className="contactPic" src="contact.jpg" alt='' />
                    <form className="contactForm" onSubmit={(e) => handleForm(e)}>
                        {/* {showPopupFail.show ?
                        <PopUpFail
                            field={showPopupFail.field}
                        />
                        : null
                    } */}
                        <input
                            className='inputForm'
                            type='text'
                            placeholder='Name'
                            onChange={(e) => setform({ ...form, name: e.target.value })}
                            required></input>
                        <input
                            className='inputForm'
                            type='email'
                            placeholder='Email'
                            onChange={(e) => setform({ ...form, email: e.target.value })}
                            required></input>
                        <textarea
                            className='inputForm inputArea'
                            placeholder='Message'
                            onChange={(e) => setform({ ...form, message: e.target.value })}
                            required />
                        <button className='contactButton' type="submit" >Send</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Contact;