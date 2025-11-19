import React from "react";
import "./EventModal.css";

const EventModal = ({ event, onClose }) => {
  if (!event) return null;

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

          <div className="modal-section">
            <div className="section-icon">📝</div>
            <div className="section-content">
              <h3>Program Details</h3>
              <p>{event.description}</p>
            </div>
          </div>

          <div className="modal-section coordinator-section">
            <div className="section-icon">👤</div>
            <div className="section-content">
              <h3>Coordinator</h3>
              <p className="coordinator-name">{event.coordinator}</p>
              <p className="coordinator-contact">
                <span>📧 {event.coordinatorEmail}</span>
                <span>📱 {event.coordinatorPhone}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
