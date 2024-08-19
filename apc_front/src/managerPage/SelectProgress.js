import React from 'react';
import './logisticsProgress.css';

const SelectProgress = ({ currentStage }) => {
  const stages = [
    { name: '입고완료', icon: '📦' },
    { name: '품질 선별', icon: '🔍' },
    { name: '선별완료', icon: '🔢' },
  ];

  return (
    <div className="progress-bar">
      {stages.map((stage, index) => (
        <div key={index} className={`stage ${index <= currentStage - 1 ? 'active' : ''}`}>
          <div className={`icon-container ${index <= currentStage - 1 ? 'active' : ''}`}>
            <div className={`icon`}>
              {stage.icon}
            </div>
          </div>
          <div className="name">{stage.name}</div>
        </div>
      ))}
      <div className="line"></div>
    </div>
  );
};

export default SelectProgress;
