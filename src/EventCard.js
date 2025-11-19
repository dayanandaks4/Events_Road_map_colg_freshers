import React, { useEffect, useRef, memo } from "react";
import { gsap } from "gsap";
import "./EventCard.css";

const EventCard = memo(
  ({ event, index, visible, position, rotation, onCardClick }) => {
    const cardRef = useRef(null);
    const hasAnimated = useRef(false);

    const handleClick = () => {
      onCardClick(index, event.angle);
    };

    // Animate card when it becomes visible for the first time
    useEffect(() => {
      if (visible && cardRef.current && !hasAnimated.current) {
        hasAnimated.current = true;
        // Start from center (0, 0) with scale 0
        gsap.fromTo(
          cardRef.current,
          {
            x: 0,
            y: 0,
            scale: 0,
            opacity: 0,
            rotation: rotation,
          },
          {
            x: position.x,
            y: position.y,
            scale: 1,
            opacity: 1,
            rotation: rotation,
            duration: 0.6,
            ease: "back.out(1.5)",
            force3D: true,
          }
        );
      }
    }, [visible, position.x, position.y, rotation]);

    // Update position and rotation when they change (after initial animation)
    useEffect(() => {
      if (visible && cardRef.current && hasAnimated.current) {
        gsap.to(cardRef.current, {
          x: position.x,
          y: position.y,
          rotation: rotation,
          duration: 0.25,
          ease: "power2.out",
          force3D: true,
        });
      }
    }, [position.x, position.y, rotation, visible]);

    return (
      <div
        ref={cardRef}
        className={`event-card ${visible ? "visible" : ""}`}
        data-index={index}
        data-angle={event.angle}
        onClick={handleClick}
      >
        <div className={`card-content ${event.gradient}`}>
          <div className="event-icon">{event.icon}</div>
          <h3>{event.title}</h3>
          <p>{event.time}</p>
        </div>
      </div>
    );
  }
);

export default EventCard;
