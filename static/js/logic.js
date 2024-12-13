let newYorkCoords = [40.73, -74.0059];
let mapZoomLevel = 12;

// Create the createMap function.
function createMap(bikeStations) {
  // Create the tile layer that will be the background of our map.
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create the map object with options.
  myMap = L.map("map-id", {
    center: newYorkCoords, 
    zoom: mapZoomLevel,
    layers: [streetmap] 
  });

  // Add the streetmap layer to the map
  streetmap.addTo(myMap);

  // Create a baseMaps object to hold the lightmap layer.
  let baseMaps = {
    Light: streetmap // You can keep this if you want to add more layers later
  };

  // Create an overlayMaps object to hold the bikeStations layer.
  let bikeLayer = L.layerGroup(bikeStations);
  let overlayMaps = {
    "Bike Stations": bikeLayer
  };

  // Add the bike layer to the map
  bikeLayer.addTo(myMap);

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);
}

let url = "https://gbfs.citibikenyc.com/gbfs/en/station_information.json";

// Create the createMarkers function.
function createMarkers(response) {
  // Pull the "stations" property from response.data.
  let stations = response.data.stations;

  // Initialize an array to hold the bike markers.
  let bikeMarkers = [];

  // Loop through the stations array.
  for (let i = 0; i < stations.length; i++) {

    let station = stations[i];

    bikeMarkers.push(
      L.marker([station.lat, station.lon]).bindPopup("Station: " + station.name + "<br>Capacity: " + station.capacity)
    );
  }

  // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
  createMap(bikeMarkers);
}

// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
d3.json(url).then(createMarkers);