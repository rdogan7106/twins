import React, { useEffect, useState } from 'react';
import MetricsBox from './metricsBox';
import axios from 'axios';

const StaticticsComponent = () => {
  const [doubleImages, setDoubleImages] = useState([]);
  const [userExpressions, setUserExpressions] = useState({});
  const [bestMatch, setBestMatch] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchDoubleImages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/comparison-details', {
        headers: {
          Authorization: token,
        },
      });
  
      const data = response.data; 
      console.log(data);
  
      if (data.length > 0) {
        setDoubleImages(data);
  
        const bestComparison = data.reduce((best, current) =>
          current.similarity_score > (best?.similarity_score || 0) ? current : best
        );
        setBestMatch(bestComparison);
  
        const expressionsCount = data.reduce((acc, img) => {
          const userEmotion = img.user_uploaded_image?.emotion;
          if (userEmotion) {
            acc[userEmotion] = (acc[userEmotion] || 0) + 1; 
          }
          return acc;
        }, {});
        setUserExpressions(expressionsCount);
      } else {
        setErrorMessage('Data cannot be found.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Data cannot be found...');
    }
  };
  
  useEffect(() => {
    fetchDoubleImages();
  }, []);

  return (
    <div className="admin-panel m-5">
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <MetricsBox
            title="Total Compared Images"
            value={doubleImages.length || 0}
            isIncrease={true}
          />
        </div>
        <div className="col-12 col-md-4">
          <MetricsBox
            title="Best Comparison"
            value={bestMatch ? `${bestMatch.similarity_score.toFixed(2)}%` : '0%'}
            imageSrc={bestMatch?.image || null}
          />
        </div>
        <div className="col-12 col-md-4">
          <MetricsBox
            title="User Expressions"
            value={
              Object.keys(userExpressions).length > 0
                ? Object.entries(userExpressions)
                    .map(([expression, count]) => `${expression}: ${count}`)
                    .join(', ')
                : '0'
            }
          />
        </div>
      </div>
      {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
    </div>
  );
  
};

export default StaticticsComponent;
