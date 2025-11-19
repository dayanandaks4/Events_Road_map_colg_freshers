import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./App.css";
import CenterBubble from "./CenterBubble";
import EventCard from "./EventCard";
import EventModal from "./EventModal";
import { eventsData } from "./eventsData";
import { getOrbitRadius, calculatePosition, debounce } from "./utils";

function App() {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState([]);
  const [orbitRotation, setOrbitRotation] = useState(0);
  const [cardPositions, setCardPositions] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const orbitRef = useRef(null);
  const cardRefs = useRef([]);

  // Initialize card positions on mount and window resize
  useEffect(() => {
    const updatePositions = () => {
      const radius = getOrbitRadius();
      const positions = eventsData.map((event) =>
        calculatePosition(event.angle, radius)
      );
      setCardPositions(positions);
    };

    updatePositions();

    const handleResize = debounce(() => {
      updatePositions();
    }, 150);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sequential pop-in animation
  useEffect(() => {
    let currentIndex = 0;

    // Show first card immediately
    setVisibleCards([0]);
    setCurrentEventIndex(0);

    // Show remaining cards one by one every 3 seconds
    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex >= eventsData.length) {
        clearInterval(interval);
        return;
      }

      setVisibleCards((prev) => [...prev, currentIndex]);
      setCurrentEventIndex(currentIndex);
    }, 3000); // Show each card every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle card click
  const handleCardClick = (index, angle) => {
    const rotationNeeded = -angle;
    const newRotation = orbitRotation + rotationNeeded;

    setOrbitRotation(newRotation);
    setCurrentEventIndex(index);

    // Animate orbit rotation with hardware acceleration
    if (orbitRef.current) {
      gsap.to(orbitRef.current, {
        duration: 0.8,
        rotation: newRotation,
        ease: "power2.inOut",
        force3D: true,
        transformPerspective: 1000,
      });
    }

    // Open modal with event details
    setSelectedEvent(eventsData[index]);
  };

  return (
    <div className="App">
      <div className="container">
        <div className="orbit-wrapper">
          <CenterBubble currentEvent={eventsData[currentEventIndex]} />

          <div
            ref={orbitRef}
            className="orbit-container"
            style={{ transform: `rotate(${orbitRotation}deg)` }}
          >
            {eventsData.map((event, index) => (
              <EventCard
                key={index}
                ref={(el) => (cardRefs.current[index] = el)}
                event={event}
                index={index}
                visible={visibleCards.includes(index)}
                position={cardPositions[index] || { x: 0, y: 0 }}
                rotation={-orbitRotation}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}

export default App;
