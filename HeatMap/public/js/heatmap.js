const blur = 1;
const radius = 25;

// Hardcoded pollution data
const pollutionData = [
  // Bahlui
  { lat: 47.153779, lng: 27.599738, pollution: 30 },
  { lat: 47.153734, lng: 27.599537, pollution: 35 },
  { lat: 47.153526, lng: 27.598553, pollution: 40 },
  { lat: 47.153578, lng: 27.598921, pollution: 45 },
  { lat: 47.153573, lng: 27.598781, pollution: 50 },
  // Venetia
  { lat: 47.169754, lng: 27.613603, pollution: 20 },
  { lat: 47.168411, lng: 27.615574, pollution: 25 },
  { lat: 47.168033, lng: 27.614536, pollution: 30 },
  { lat: 47.166602, lng: 27.616414, pollution: 35 },

  // Ezareni
  { lat: 47.118627, lng: 27.528308, pollution: 60 },
  { lat: 47.118861, lng: 27.530711, pollution: 65 },
  { lat: 47.116554, lng: 27.538135, pollution: 70 },
  { lat: 47.116685, lng: 27.546075, pollution: 75 },
  { lat: 47.114802, lng: 27.551160, pollution: 72 },
  { lat: 47.111458, lng: 27.555709, pollution: 68 },
];

// Convert the values to points & weights
const features = pollutionData.map(item => {
  const feature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([item.lng, item.lat])),
    weight: item.pollution / 100, // Aici ar trebui facuta o normalizare for real
  });
  return feature;
});

// Gather the features in a vector
const vectorSource = new ol.source.Vector({
  features: features,
});

// Add the blur, radius and vectorLayer to the heatmap
const heatmapLayer = new ol.layer.Heatmap({
  source: vectorSource,
  blur: blur,
  radius: radius,
});

// Create map
const map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(), // OpenStreetMap
    }),
    heatmapLayer // Render the heatmap layer on top
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([27.6014, 47.1585]), // Center = IAsi
    zoom: 13,
  }),
});

