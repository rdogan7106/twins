import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ComparisonCardDouble from '@/components/comparePageComponents/comprasionCardDouble';
import { DeleteUser } from '@/api/api';

const ComparedImagesDouble = () => {
  const [doubleImages, setDoubleImages] = useState([]);

  const fetchDoubleImages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/comparison-details', {
        headers: {
          'Authorization': token
        }
      });
      setDoubleImages(response.data);
    } catch (error) {
      console.error('Error fetching saved images:', error);
    }
  };

  const handleDelete = async(id) => {
    await(DeleteUser(id));
    fetchDoubleImages();
  };

  useEffect(() => {
    fetchDoubleImages();
  }, []);

  return (
    <div className="container mt-5 d-flex flex-wrap">
      {doubleImages.length === 0 ? (
        <p>No saved images found.</p>
      ) : (
        doubleImages.map((img, index) => (
          <ComparisonCardDouble key={index} {...img} onDelete={handleDelete} />
        ))
      )}
    </div>
  );
};

export default ComparedImagesDouble;