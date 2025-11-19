import React from "react";
import "./EventModal.css";

const EventModal = ({ event, onClose }) => {
  if (!event) return null;

  // Parse program details into list items
  const formatProgramDetails = (description) => {
    // Split by bullet points or numbered items
    const items = description.split(/[•·]|\d+\)/).filter((item) => item.trim());
    return items;
  };

  const programItems = formatProgramDetails(event.description);
  const isSingleItem = programItems.length <= 1;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <div className="modal-icon">{event.icon}</div>
          <h2 className="modal-title">{event.title}</h2>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <div className="section-icon">🕒</div>
            <div className="section-content">
              <h3>Time</h3>
              <p>{event.time}</p>
            </div>
          </div>

          <div className="modal-section">
            <div className="section-icon">📍</div>
            <div className="section-content">
              <h3>Venue</h3>
              <p>{event.venue}</p>
            </div>
          </div>

          <div className="modal-section program-section">
            <div className="section-icon">📝</div>
            <div className="section-content">
              <h3>Program Details</h3>
              {isSingleItem ? (
                <p className="single-item">{event.description}</p>
              ) : (
                <ul className="program-list">
                  {programItems.map((item, index) => (
                    <li key={index}>{item.trim()}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="modal-section coordinator-section">
            <div className="section-icon">👤</div>
            <div className="section-content">
              <h3>Coordinator</h3>
              <p className="coordinator-name">{event.coordinator}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
