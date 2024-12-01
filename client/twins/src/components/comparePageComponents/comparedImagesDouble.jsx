import React from 'react';
import ComparisonCardDouble from '../../components/comparePageComponents/comprasionCardDouble';

const ComparedImagesDouble = ({ images ,onDelete}) => {
  return (
    <div className="container mt-5 d-flex flex-wrap">
      {images.length === 0 ? (
        <p>No saved images found.</p>
      ) : (
        images.map((img, index) => (
          <ComparisonCardDouble key={index} {...img}  onDelete={onDelete}/>
        ))
      )}
    </div>
  );
};

export default ComparedImagesDouble;
