import React from "react";
import "./CenterBubble.css";

const CenterBubble = ({ currentEvent }) => {
  return (
    <div className="center-bubble">
      <div className="glow-ring"></div>
      <div className="bubble-content">
        <div className="event-icon">{currentEvent.icon}</div>
        <div className="current-label">CURRENT EVENT</div>
        <h2 className="event-title">{currentEvent.title}</h2>
        <p className="event-time">{currentEvent.time}</p>
        <button className="explore-btn">EXPLORE</button>
      </div>
    </div>
  );
};

export default CenterBubble;
