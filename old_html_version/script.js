// Event data array matching the reference image
const eventsData = [
  {
    icon: "👗",
    title: "Fashion Show",
    time: "Dec 15, 6:00 PM - 9:00 PM",
    angle: 0,
  },
  {
    icon: "📚",
    title: "Literature Quiz",
    time: "Nov 19, 3:00 PM - 5:30 PM",
    angle: 30,
  },
  {
    icon: "⚽",
    title: "Sports Tournament",
    time: "Nov 20",
    angle: 60,
  },
  {
    icon: "🎤",
    title: "Poetry Slam",
    time: "Dec 8, 4:00 PM",
    angle: 90,
  },
  {
    icon: "🎨",
    title: "Art Workshop",
    time: "Dec 14, 2:00 PM",
    angle: 120,
  },
  {
    icon: "💃",
    title: "Dance Competition",
    time: "Dec 12, 4:00 PM - 8:00 PM",
    angle: 150,
  },
  {
    icon: "🍳",
    title: "Cooking Challenge",
    time: "Dec 10, 11:00 AM - 2:00 PM",
    angle: 180,
  },
  {
    icon: "📷",
    title: "Photography Contest",
    time: "Dec 8, 9:00 AM - 5:00 PM",
    angle: 210,
  },
  {
    icon: "✏️",
    title: "Sketching Exhibition Day",
    time: "Dec 5",
    angle: 240,
  },
  {
    icon: "💻",
    title: "Coding Marathon",
    time: "Dec 5-6, 3:00 AM - 9:00 AM",
    angle: 270,
  },
  {
    icon: "🎵",
    title: "Music Concert",
    time: "Dec 6, 6:30 PM - 9:00 PM",
    angle: 300,
  },
  {
    icon: "🎭",
    title: "Drama Festival",
    time: "Nov 30, 5:00 PM - 9:00 PM",
    angle: 330,
  },
];

// Global variables
let currentRotation = 0;
let currentEventIndex = 11; // Drama Festival is initially shown

// Initialize on page load
window.addEventListener("DOMContentLoaded", () => {
  initializeOrbit();
  startSequentialPopIn();
  attachEventListeners();
});

// Position event cards in circular orbit
function initializeOrbit() {
  const eventCards = document.querySelectorAll(".event-card");
  const radius = getOrbitRadius();

  eventCards.forEach((card, index) => {
    const angle = eventsData[index].angle;
    const angleRad = (angle - 90) * (Math.PI / 180); // -90 to start from top

    const x = radius * Math.cos(angleRad);
    const y = radius * Math.sin(angleRad);

    // Set initial position with GSAP to avoid transform conflicts
    gsap.set(card, {
      x: x,
      y: y,
      scale: 0,
      opacity: 0,
    });

    card.setAttribute("data-angle", angle);
    card.setAttribute("data-index", index);
  });
}

// Get orbit radius based on screen size
function getOrbitRadius() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const minDimension = Math.min(width, height);

  if (width <= 380) {
    // Extra small phones - much smaller to fit in viewport
    return minDimension * 0.28;
  }
  if (width <= 480) {
    // Small phones - reduced to prevent overflow
    return minDimension * 0.3;
  }
  if (width <= 768) {
    // Tablets - conservative sizing
    return minDimension * 0.32;
  }
  if (width <= 1024) {
    // Small desktops
    return 330;
  }
  // Large desktops - make it much wider for proper spacing
  return 420;
}

// Sequential pop-in animation - one event every 5 seconds
function startSequentialPopIn() {
  const eventCards = document.querySelectorAll(".event-card");
  let currentIndex = 0;

  // Show first event immediately
  showEventCard(eventCards[currentIndex]);
  currentIndex++;

  // Show remaining events every 5 seconds
  const popInInterval = setInterval(() => {
    if (currentIndex >= eventCards.length) {
      clearInterval(popInInterval);
      return;
    }

    showEventCard(eventCards[currentIndex]);

    // Update center bubble to show current popping event
    updateCenterBubble(currentIndex);

    currentIndex++;
  }, 5000); // 5 seconds = 5000ms
}

// Show individual event card with scale + fade animation
function showEventCard(card) {
  const index = parseInt(card.getAttribute("data-index"));
  const angle = eventsData[index].angle;
  const radius = getOrbitRadius();
  const angleRad = (angle - 90) * (Math.PI / 180);

  const x = radius * Math.cos(angleRad);
  const y = radius * Math.sin(angleRad);

  // Use GSAP for smooth animation
  gsap.to(card, {
    duration: 0.8,
    opacity: 1,
    scale: 1,
    x: x,
    y: y,
    ease: "back.out(1.7)",
    onComplete: () => {
      card.classList.add("visible");
    },
  });
}

// Update center bubble with event details
function updateCenterBubble(eventIndex) {
  const event = eventsData[eventIndex];
  const centerBubble = document.querySelector(".bubble-content");

  const eventIcon = centerBubble.querySelector(".event-icon");
  const eventTitle = centerBubble.querySelector(".event-title");
  const eventTime = centerBubble.querySelector(".event-time");

  // Fade out
  gsap.to(centerBubble, {
    duration: 0.3,
    opacity: 0,
    scale: 0.9,
    onComplete: () => {
      // Update content
      eventIcon.textContent = event.icon;
      eventTitle.textContent = event.title;
      eventTime.textContent = event.time;

      // Fade in
      gsap.to(centerBubble, {
        duration: 0.4,
        opacity: 1,
        scale: 1,
        ease: "back.out(1.5)",
      });
    },
  });

  currentEventIndex = eventIndex;
}

// Attach click event listeners to all event cards
function attachEventListeners() {
  const eventCards = document.querySelectorAll(".event-card");

  eventCards.forEach((card) => {
    card.addEventListener("click", () => {
      const clickedIndex = parseInt(card.getAttribute("data-index"));
      const clickedAngle = parseInt(card.getAttribute("data-angle"));

      // Rotate orbit to bring clicked event to the front (top position)
      rotateOrbitToEvent(clickedAngle, clickedIndex);
    });
  });
}

// Rotate orbit to bring selected event to front
function rotateOrbitToEvent(targetAngle, eventIndex) {
  const orbitContainer = document.querySelector(".orbit-container");

  // Calculate rotation needed to bring event to front (0 degrees = top)
  // We want the clicked event to be at angle 0 (top position)
  const rotationNeeded = -targetAngle;
  const finalRotation = currentRotation + rotationNeeded;

  // Smooth rotation using GSAP
  gsap.to(orbitContainer, {
    duration: 1,
    rotation: finalRotation,
    ease: "power2.inOut",
    onComplete: () => {
      currentRotation = finalRotation;

      // Counter-rotate all event cards to keep them upright
      const eventCards = document.querySelectorAll(".event-card");
      eventCards.forEach((card) => {
        gsap.to(card, {
          duration: 1,
          rotation: -finalRotation,
          ease: "power2.inOut",
        });
      });
    },
  });

  // Counter-rotate cards immediately during orbit rotation
  const eventCards = document.querySelectorAll(".event-card");
  eventCards.forEach((card) => {
    gsap.to(card, {
      duration: 1,
      rotation: -finalRotation,
      ease: "power2.inOut",
    });
  });

  // Update center bubble
  updateCenterBubble(eventIndex);
}

// Handle window resize to recalculate positions
window.addEventListener(
  "resize",
  debounce(() => {
    const eventCards = document.querySelectorAll(".event-card.visible");
    const radius = getOrbitRadius();

    eventCards.forEach((card) => {
      const index = parseInt(card.getAttribute("data-index"));
      const angle = eventsData[index].angle;
      const angleRad = (angle - 90) * (Math.PI / 180);

      const x = radius * Math.cos(angleRad);
      const y = radius * Math.sin(angleRad);

      gsap.to(card, {
        duration: 0.3,
        x: x,
        y: y,
      });
    });
  }, 250)
);

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add touch support for mobile devices
if ("ontouchstart" in window) {
  const eventCards = document.querySelectorAll(".event-card");
  eventCards.forEach((card) => {
    card.addEventListener("touchstart", (e) => {
      e.preventDefault();
      card.click();
    });
  });
}
