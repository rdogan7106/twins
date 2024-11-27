"use client";
import React, { useState } from 'react';
import ComparedImages from '@/components/comparePageComponents/comparedImages';
import ComparedImagesDouble from '@/components/comparePageComponents/comparedImagesDouble'; 
import StaticticsComponent from '@/components/dashboardPageComponents/staticticsComponent';

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState('single');
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
    <div>
        <label htmlFor="image-select">Choose an image type: </label>
        <select 
          id="image-select" 
          value={selectedOption} 
          onChange={handleSelectChange}
        >
          <option value="single">Compared Images</option>
          <option value="double">Double Images</option>
        </select>
      </div>
      <StaticticsComponent />    
      {selectedOption === 'single' ? <ComparedImages /> : <ComparedImagesDouble />}
    </>
  );
};

export default Dashboard;
