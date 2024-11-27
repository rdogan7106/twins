import React from 'react';
import "./contactInfo_css.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faLocationDot, faPhone, faMailBulk } from '@fortawesome/free-solid-svg-icons';

const ContactInfo = ({ address, phone, email }) => {
    return (
        <div className="contact-info">
            <h2 className="contact-title">Contact Us</h2>
            <div className='contact-info-container d-flex justify-content-around'>
                <div className='info-box'>
                <FontAwesomeIcon icon={faLocationDot} className="icon icon1 icon_size" />
                    <strong>Address:</strong>
                    <p>{address}</p>
                </div>
                <div className='info-box'>
                <FontAwesomeIcon icon={faPhone} className="icon icon1" />
                    <strong>Phone:</strong>
                    <p>{phone}</p>
                </div>
                <div className='info-box'>
                <FontAwesomeIcon icon={faMailBulk} className="icon icon1" />                    
                <strong>Email:</strong>
                    <p>{email}</p>
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;
