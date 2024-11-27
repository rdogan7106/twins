import React from 'react';
import ContactMap from './contactMap';
import ContactInfo from './contactInfo';
import ContactForm from './contactForm';
import './contactComponent_css.css';
const Contact = () => {
    const location = 'Propellen Gatan 1, Malmö, Sweden 10038';
    const address = 'A108 Adam Street, Malmö, Sweden 535022';
    const phone = '+1 234 4567 55';
    const email = 'info@twins.com';

    return (
        <div className="contact">
                <ContactInfo address={address} phone={phone} email={email} />

            <div className='container d-flex'>
                <ContactMap location={location} />
                <ContactForm />
            </div>
        </div>
    );
};

export default Contact;