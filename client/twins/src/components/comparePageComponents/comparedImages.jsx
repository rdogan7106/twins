"use client"

import React, { useState, useEffect } from "react";
import axios from 'axios';
import { DeleteUser } from '@/api/api';

const ComparedImages = () => {
    const [savedImages, setSavedImages] = useState([]);

    const fetchSavedImages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/user-comparisons', {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': token
                }
            });
            setSavedImages(response.data);
        } catch (error) {
            console.error('Error fetching saved images:', error);
        }
    };

    const handleDelete = async(id) => {
        await(DeleteUser(id));
        fetchSavedImages();
      };

    useEffect(() => {
        fetchSavedImages();
    }, []);

    return (
        <div className="mt-5">
            {savedImages.length === 0 ? (
                <p>No saved images found.</p>
            ) : (
                <div className="d-flex flex-wrap justify-content-center mx-3">
                    {savedImages.map((img, index) => (
                        <div key={index} className="card m-2 w-25"> 
                            <img src={img.comparison_image.image_data} className="card-img-top" alt="Saved" />
                            <div className="card-body ">
                                <p>Age: {img.comparison_image.age}</p>
                                <p>Gender: {img.comparison_image.gender}</p>
                                <p>Emotion: {img.comparison_image.emotion}</p>
                                <p>Ethnicity: {img.comparison_image.ethnicity}</p>
                                <p>Score: {img.similarity_score.toFixed(2)}</p>
                                <div className="card-footer text-center p-0 ">
                                    <button onClick={() => handleDelete(img.comparison_id)} className="btn btn-danger w-100 rounded">Delete</button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ComparedImages;