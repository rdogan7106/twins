import React from 'react';
import MetricsBox from './metricsBox';

const StaticticsComponent = ({ doubleImages }) => {
  const calculateStatistics = () => {
    const bestMatch = doubleImages.reduce(
      (best, current) =>
        current.similarity_score > (best?.similarity_score || 0) ? current : best,
      null
    );

    const userExpressions = doubleImages.reduce((acc, img) => {
      const userEmotion = img.user_uploaded_image?.emotion;
      if (userEmotion) {
        acc[userEmotion] = (acc[userEmotion] || 0) + 1;
      }
      return acc;
    }, {});

    return { bestMatch, userExpressions };
  };

  const { bestMatch, userExpressions } = calculateStatistics();

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
    </div>
  );
};

export default StaticticsComponent;
