"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ComparedImages from '@/components/comparePageComponents/comparedImages';
import ComparedImagesDouble from '@/components/comparePageComponents/comparedImagesDouble';
import StaticticsComponent from '@/components/dashboardPageComponents/staticticsComponent';
import { DeleteUser } from '@/api/api';
const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState('single');
  const [singleImagesData, setSingleImagesData] = useState([]);
  const [doubleImagesData, setDoubleImagesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSingleImages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/user-comparisons', {
        headers: { Authorization: token },
      });
      setSingleImagesData(response.data);
    } catch (error) {
      console.error('Error fetching single images:', error);
    }
  };

  const fetchDoubleImages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/comparison-details', {
        headers: { Authorization: token },
      });
      setDoubleImagesData(response.data);
    } catch (error) {
      console.error('Error fetching double images:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await DeleteUser(id);
      fetchSingleImages();
      fetchDoubleImages();
    } catch (error) {
      console.error('Error deleting comparison:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchSingleImages(), fetchDoubleImages()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <label htmlFor="image-select" className="form-label me-3">Choose an image type:</label>
        <select
          id="image-select"
          value={selectedOption}
          onChange={handleSelectChange}
          className="form-select w-auto d-inline-block"
        >
          <option value="single">Compared Images</option>
          <option value="double">Double Images</option>
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <StaticticsComponent doubleImages={doubleImagesData}  />
          {selectedOption === 'single' ? (
            <ComparedImages images={singleImagesData} onDelete={handleDelete} />
          ) : (
            <ComparedImagesDouble images={doubleImagesData}  onDelete={handleDelete}/>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
