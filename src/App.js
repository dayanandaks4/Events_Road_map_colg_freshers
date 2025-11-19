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
  const [revealedEvents, setRevealedEvents] = useState([]); // Track which events have details revealed
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

  // Sequential pop-in animation - show all cards quickly in circle order
  useEffect(() => {
    // Sort events by angle to ensure proper circle order
    const sortedIndices = eventsData
      .map((event, index) => ({ index, angle: event.angle }))
      .sort((a, b) => a.angle - b.angle)
      .map((item) => item.index);

    let currentStep = 0;

    // Show first card immediately
    const firstIndex = sortedIndices[0];
    setVisibleCards([firstIndex]);

    // Show remaining cards one by one every 0.3 seconds in circle order
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= sortedIndices.length) {
        clearInterval(interval);
        return;
      }

      const nextIndex = sortedIndices[currentStep];
      setVisibleCards((prev) => [...prev, nextIndex]);
    }, 300); // Pop up each card every 0.3 seconds

    return () => clearInterval(interval);
  }, []);

  // Rotate the orbit container clockwise after all cards pop up
  useEffect(() => {
    let rotationInterval;

    // Wait for all cards to pop up (12 cards * 300ms = 3600ms + 200ms buffer)
    const startTimer = setTimeout(() => {
      rotationInterval = setInterval(() => {
        setOrbitRotation((prev) => prev + 0.2); // Faster clockwise rotation
      }, 20); // Update every 20ms for smooth animation
    }, 3800);

    return () => {
      clearTimeout(startTimer);
      if (rotationInterval) clearInterval(rotationInterval);
    };
  }, []);

  // Real-time based event reveal - check every 10 seconds
  useEffect(() => {
    const checkEventTimes = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const revealed = [];
      let latestEventIndex = 0;

      eventsData.forEach((event, index) => {
        // Parse event time (e.g., "7:30 AM – 8:00 AM")
        const timeMatch = event.time.match(/(\d+):(\d+)\s*(AM|PM)/);
        if (timeMatch) {
          let eventHour = parseInt(timeMatch[1]);
          const eventMinute = parseInt(timeMatch[2]);
          const period = timeMatch[3];

          // Convert to 24-hour format
          if (period === "PM" && eventHour !== 12) {
            eventHour += 12;
          } else if (period === "AM" && eventHour === 12) {
            eventHour = 0;
          }

          // Check if current time has passed the event start time
          if (
            currentHour > eventHour ||
            (currentHour === eventHour && currentMinute >= eventMinute)
          ) {
            revealed.push(index);
            latestEventIndex = index;
          }
        }
      });

      // If no events have started yet, show all as coming soon
      if (revealed.length === 0) {
        setRevealedEvents([]);
        setCurrentEventIndex(0);
      } else {
        setRevealedEvents(revealed);
        setCurrentEventIndex(latestEventIndex);
      }
    };

    // Check immediately
    checkEventTimes();

    // Check every 10 seconds
    const interval = setInterval(checkEventTimes, 10000);

    return () => clearInterval(interval);
  }, []);

  // Handle card click - no rotation, just update center and open modal
  const handleCardClick = (index, angle) => {
    setCurrentEventIndex(index);

    // Open modal with event details only if revealed
    if (revealedEvents.includes(index)) {
      setSelectedEvent(eventsData[index]);
    }
  };

  return (
    <div className="App">
      <h1 className="main-heading">Event Roadmap </h1>
      <div className="container">
        <div className="orbit-wrapper">
          <CenterBubble
            currentEvent={eventsData[currentEventIndex]}
            revealed={revealedEvents.includes(currentEventIndex)}
          />

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
                revealed={revealedEvents.includes(index)}
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
