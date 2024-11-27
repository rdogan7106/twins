"use client";
import React, { useState, useEffect } from 'react';
import ProfilComponent from '@/components/comparePageComponents/profilComponent.jsx';
import axios from 'axios';

const Compare = () => {
    const [leftImageSrc, setLeftImageSrc] = useState(null);
    const [rightImageSrc, setRightImageSrc] = useState(null);
    const [leftPredictions, setLeftPredictions] = useState(null);
    const [rightPredictions, setRightPredictions] = useState(null);

    const handleCompare = async () => {
        if (leftImageSrc && rightImageSrc) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found. Please log in.');
                }
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': token 
                    },
                };
                
                const [leftResponse, rightResponse] = await Promise.all([
                    axios.post('http://localhost:5000/capture', { image: leftImageSrc, is_self: true }, config),
                    axios.post('http://localhost:5000/capture', { image: rightImageSrc, is_self: false }, config)
                ]);    
                setLeftPredictions(leftResponse.data.predictions[0]);  
                setRightPredictions(rightResponse.data.predictions[0]);
    
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.error('Authentication failed. Please log in again.');
                } else {
                    console.error('Error comparing images:', error);
                }
            }
        } else {
            alert('Please upload or capture both images before comparing.');
        }
    };
    
    return (
        <div className="container-fluid">
            <h1>Compare</h1>
            <div className='d-flex justify-content-evenly'>
                <ProfilComponent 
                    imageSrc={leftImageSrc} 
                    setImageSrc={setLeftImageSrc}
                    predictions={leftPredictions}
                    setPredictions={setLeftPredictions}
                    isLeft={true}
                />
                <ProfilComponent 
                    imageSrc={rightImageSrc} 
                    setImageSrc={setRightImageSrc}
                    predictions={rightPredictions}
                    setPredictions={setRightPredictions}
                    isLeft={false}
                />
            </div>
            <div className="text-center mt-3">
                <button className="btn btn-primary" onClick={handleCompare}>Compare</button>
            </div>
            
        </div>
    );
};

export default Compare;