import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleGroup, faHandshake, faAward, faChartLine } from '@fortawesome/free-solid-svg-icons';
import './statistisSection_css.css';

function StatistisSection() {
    const membersRef = useRef(null);
    const matchingRef = useRef(null);
    const meetingRef = useRef(null);
    const friendshipRef = useRef(null);

    const animateCounter = (element, target, duration) => {
        const increment = target / (duration / 10); 
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 10);
    };

    useEffect(() => {        
        if (membersRef.current) animateCounter(membersRef.current, 4412, 2000);
        if (matchingRef.current) animateCounter(matchingRef.current, 3210, 2500);
        if (meetingRef.current) animateCounter(meetingRef.current, 2300, 3000);
        if (friendshipRef.current) animateCounter(friendshipRef.current, 900, 3500);
    }, []); 

    return (
        <div className="stats-section d-flex justify-content-around slide-fwd-center">
            <div className="stat-item d-flex justify-content-between">
                <div className='mx-2'>
                    <h3 ref={membersRef}>0</h3>
                    <p>Members</p>
                </div>
                <FontAwesomeIcon icon={faPeopleGroup} className="icon icon1" />
            </div>
            <div className="stat-item d-flex justify-content-between">
                <div className='d-flex flex-column mx-2'>
                    <h3 ref={matchingRef}>0</h3>
                    <p>Matching</p>
                </div>
                <FontAwesomeIcon icon={faHandshake} className="icon icon2" />
            </div>
            <div className="stat-item d-flex justify-content-between">
                <div className='mx-2'>
                    <h3 ref={meetingRef}>0</h3>
                    <p>Meeting</p>
                </div>
                <FontAwesomeIcon icon={faAward} className="icon icon3" />
            </div>
            <div className="stat-item d-flex justify-content-between">
                <div className='mx-2'>
                    <h3 ref={friendshipRef}>0</h3>
                    <p>New Friendship</p>
                </div>
                <FontAwesomeIcon icon={faChartLine} className="icon icon4" />
            </div>
        </div>
    );
}

export default StatistisSection;
