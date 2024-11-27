import React from 'react';
const ComparisonCard = ({ comparison_id, similarity_score, user_uploaded_image, comparison_image, onDelete }) => {
  return ( 
    <div className="card w-50 " >
      <div className="row g-0 d-flex m-3 justify-content-center">
        <div className="col-md-3">
        <h5 className="card-title">User Image</h5>
          <img src={user_uploaded_image.image_data} className="img-fluid rounded shadow" alt="User Uploaded" />
        
        </div>
        <div className="col-md-3 d-flex align-items-center justify-content-center">
          <div>
            <h5>Similarity</h5>
            <p>{similarity_score.toFixed(2)}%</p>
          </div>
        </div>
        <div className="col-md-3">
        <h5 className="card-title">Comparison </h5>
          <img src={comparison_image.image_data} className="img-fluid rounded w-100 shadow"  alt="Comparison" />
         
        </div>
        
      </div>
      <div className="card-footer text-center">
        <button onClick={() => onDelete(comparison_id)} className="btn btn-danger">Delete</button>
      </div>
    </div>
  );
};

export default ComparisonCard;