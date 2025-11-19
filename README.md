# Events Roadmap - React

A fully responsive, interactive circular event timeline built with React. Features smooth animations, dynamic event cards arranged in a circular orbit, and perfect mobile responsiveness across all screen sizes.

## Features

- ✨ Circular event layout with 12 event cards
- 🎯 Interactive center bubble showing current event
- 🔄 Smooth rotation animations with GSAP
- 📱 Fully responsive design for all screen sizes (360px - 1920px+)
- 🎨 Beautiful gradient color schemes for each event
- ⚡ Sequential pop-in animations
- 🖱️ Click events to rotate and explore

## Mobile Responsive Breakpoints

- **Desktop (1024px+)**: Full-size layout with large orbit
- **Tablet (768px-1024px)**: Medium-sized orbit
- **Mobile (480px-768px)**: Compact layout
- **Small Mobile (360px-480px)**: Extra compact for small screens
- **Extra Small (< 360px)**: Optimized for very small devices

## Installation

```bash
npm install
```

## Running the App

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Build for Production

```bash
npm run build
```

## Technologies Used

- React 18
- GSAP (GreenSock Animation Platform)
- CSS3 with responsive media queries
- Modern JavaScript (ES6+)

## Structure

```
src/
├── App.js              # Main application component
├── App.css             # Main app styles
├── CenterBubble.js     # Center event display component
├── CenterBubble.css    # Center bubble styles
├── EventCard.js        # Individual event card component
├── EventCard.css       # Event card styles
├── eventsData.js       # Event data configuration
├── utils.js            # Utility functions
├── index.js            # React entry point
└── index.css           # Global styles
```

## Customization

Edit `src/eventsData.js` to modify events:

```javascript
{
  icon: "🎭",
  title: "Your Event",
  time: "Date & Time",
  angle: 0,  // Position angle (0-360)
  gradient: "gradient-blue"  // Color scheme
}
```

## License

MIT
