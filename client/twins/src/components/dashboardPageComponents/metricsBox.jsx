import React from 'react';
import './metricsBox_css.css';

const MetricsBox = ({ title, value}) => {
  return (
    <div className="metrics-box shadow rounded p-3 d-flex flex-column justify-content-between align-items-start">
      <h6 className="metrics-title">{title}</h6>
      <div className="metrics-content d-flex flex-column align-items-start">
        <span className="metrics-value">{value ?? '0'}</span>  
      </div>
    </div>
  );
};

export default MetricsBox;
