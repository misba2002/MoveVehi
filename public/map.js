document.addEventListener("DOMContentLoaded", () => {
  console.log("js is running !");
  const orsKey =
    "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjBjMzEwMDc1ODYyYTQ4MzI4MDUyYzVhYzRiYTgwM2FjIiwiaCI6Im11cm11cjY0In0=";

  const map = L.map("map").setView([12.976347, 77.569427], 14);

  

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const carIcon = L.icon({
    iconUrl: "/images/car.png",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  let geojsonData = null;
  let routePoints = null;
  let latlngs = [];
  let carMarker = null;
  let interval = null;
  let i = 0;
  let routeDrawn = false;

  const speedMap = {
    slow: 400,
    medium: 200,
    fast: 100,
    veryfast: 50,
  };

  fetch("/route.json")
    .then((res) => res.json())
    .then((points) => {
      routePoints = points;
      const coordinates = points.map((p) => [p.longitude, p.latitude]);

      fetch(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
          method: "POST",
          headers: {
            Authorization: orsKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ coordinates }),
        }
      )
        .then((res) => res.json())
        .then((geojson) => {
          geojsonData = geojson;

          const path = geojson.features[0].geometry.coordinates;
          latlngs = path.map((p) => [p[1], p[0]]);

          // Place car at starting point
          carMarker = L.marker(latlngs[0], { icon: carIcon })
            .addTo(map)
            .bindPopup(
              `🚗 Starting Point<br>Lat: ${latlngs[0][0].toFixed(
                5
              )}<br>Lng: ${latlngs[0][1].toFixed(5)}`
            )
            .openPopup();
        })
        .catch((err) => console.error("ORS error:", err));
    });

  function drawRouteAndStops() {
    if (!geojsonData || !routePoints) return;

    L.geoJSON(geojsonData, { style: { color: "blue", weight: 4 } }).addTo(map);

    routePoints.forEach((stop) => {
      const stopLatLng = [stop.latitude, stop.longitude];
      const stopIcon = L.icon({
        iconUrl: "images/map-pin.png",
        iconSize: [35, 35],
        iconAnchor: [20, 40],
        popupAnchor: [0, -30],
      });

      L.marker(stopLatLng, { icon: stopIcon })
        .addTo(map)
        .bindPopup(
          `📍 ${stop.name || "Stop"}<br>Lat: ${stop.latitude.toFixed(
            5
          )}<br>Lng: ${stop.longitude.toFixed(5)}`
        );
    });

    const bounds = L.geoJSON(geojsonData).getBounds();
    map.fitBounds(bounds);
  }

  function moveCar() {
    if (i >= latlngs.length) {
      clearInterval(interval);
      interval = null;
      return;
    }
    carMarker.setLatLng(latlngs[i]);
    i++;
  }

  function startCar() {
    if (!routeDrawn) {
      drawRouteAndStops();
      routeDrawn = true;
    }

    if (!interval) {
      const speedValue = document.getElementById("speed").value;
      const delay = speedMap[speedValue] || 200;
      interval = setInterval(moveCar, delay);
      console.log(`Car started at speed: ${speedValue} (${delay}ms)`);
    }
  }

  function stopCar() {
    clearInterval(interval);
    interval = null;
  }

  document.getElementById("play").addEventListener("click", startCar);

  document.getElementById("stop").addEventListener("click", stopCar);

  document.getElementById("speed").addEventListener("change", () => {
    if (interval) {
      stopCar();
      startCar(); // restart with new speed
    }
  });
});
