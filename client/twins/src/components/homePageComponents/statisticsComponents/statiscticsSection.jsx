import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleGroup, faHandshake, faAward, faChartLine } from '@fortawesome/free-solid-svg-icons';
import './statistisSection_css.css';

function StatistisSection() {
    return (
        <div className="stats-section d-flex justify-content-around .slide-fwd-center">
            <div className="stat-item d-flex  justify-content-between">
                <div className='mx-2'>
                    <h3>100+</h3>
                    <p>Members</p>
                </div>
                <FontAwesomeIcon icon={faPeopleGroup} className="icon icon1" />
            </div>
            <div className="stat-item d-flex  justify-content-between">
                <div className='d-flex flex-column mx-2'>
                    <h3>200+</h3>
                    <p>Macthing</p>
                </div>
                <FontAwesomeIcon icon={faHandshake} className="icon icon2" />
            </div>
            <div className="stat-item d-flex  justify-content-between">
                <div className='mx-2'>

                    <h3>300+</h3>
                    <p>Meeting</p>
                </div>
                <FontAwesomeIcon icon={faAward} className="icon icon3" />
            </div>
            <div className="stat-item d-flex  justify-content-between">
                <div className='mx-2'>

                    <h3>400+</h3>
                    <p>New Friendship</p>
                </div>
                <FontAwesomeIcon icon={faChartLine} className="icon icon4" />
            </div>
        </div>
    );
}

export default StatistisSection;
