🚗 vehiMove



An interactive vehicle route simulator built with Node.js, Express, Leaflet.js, and the OpenRouteService API.
It animates a car along a calculated driving route between predefined stops on a map, with adjustable speed and custom markers.

📋 Features

✅ Interactive Leaflet map with OpenStreetMap tiles.

✅ Reads route points from a JSON file & shows stops with popups.

✅ Car icon moves along the route — speed controlled by user.

✅ Route generated via OpenRouteService Directions API.

✅ Responsive & mobile-friendly UI with play/stop controls.

📂 Project Structure
|
├── public/
│   ├── images/            # map-pin.png, car.png, bg.jpg
│   ├── style.css          # styles
│   ├── map.js             # Leaflet + animation logic
│
├── views/
│   └── index.ejs          # main page template
│
├── route.json             # route points with lat/lng & names
├── index.js               # Express server
├── package.json
├── .gitignore
└── README.md
🚀 Getting Started
📥 Install & Run

**Live demo**:
https://movevehi.onrender.com


git clone <your-repo-url>
cd <your-repo>
npm install
node index.js
Visit 👉 http://localhost:3000

🔑 API Key
Replace the ORS API key in public/map.js:
const orsKey = "your_openrouteservice_api_key";
Get a free key at 👉 https://openrouteservice.org/

