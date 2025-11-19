// Get orbit radius based on screen size
export const getOrbitRadius = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const minDimension = Math.min(width, height);

  if (width <= 360) {
    // Extra small phones - keep cards very close to center
    return minDimension * 0.22;
  }
  if (width <= 480) {
    // Small phones - tighter orbit
    return minDimension * 0.24;
  }
  if (width <= 768) {
    // Tablets - reduced radius for better containment
    return minDimension * 0.26;
  }
  if (width <= 1024) {
    // Medium screens - laptop
    return 320;
  }
  if (width <= 1440) {
    // Standard desktop
    return 400;
  }
  if (width <= 1920) {
    // Large desktop/Full HD
    return 450;
  }
  // Extra large screens - 2K, 4K
  return 500;
};

// Calculate X and Y position for an event card based on angle and radius
export const calculatePosition = (angle, radius) => {
  const angleRad = (angle - 90) * (Math.PI / 180); // -90 to start from top
  const x = radius * Math.cos(angleRad);
  const y = radius * Math.sin(angleRad);
  return { x, y };
};

// Debounce utility function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
