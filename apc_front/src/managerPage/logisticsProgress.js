import React from 'react';
import './logisticsProgress.css';

const LogisticsProgress = ({ currentStage }) => {
  const stages = [
    { name: 'APC 출고', icon: '📅' },
    { name: '이동중', icon: '🚚' },
    { name: 'ES 물류창고', icon: '📦' },
    { name: '이동중', icon: '🚚' },
    { name: '곤지암HUB', icon: '📦' },
    { name: '이동중', icon: '🚚' },
    { name: '서울우체국', icon: '📦' },
    { name: '배달중', icon: '🚚' },
    { name: '배송완료', icon: '✔️' }
  ];

  return (
    <div className="progress-bar">
      {stages.map((stage, index) => (
        <div key={index} className={`stage ${index <= currentStage ? 'active' : ''}`}>
          <div className={`icon-container ${index <= currentStage ? 'active' : ''}`}>
            <div className={`icon ${stage.name === '이동중' || stage.name === '배달중' ? 'rotate' : ''}`}>
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

export default LogisticsProgress;
