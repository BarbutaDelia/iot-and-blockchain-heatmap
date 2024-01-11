document.addEventListener("DOMContentLoaded", function(){
  fetch('/pollution') 
    .then(response => response.json())
    .then(pollutionData => {
      initializeHeatMap(pollutionData);
      console.log(pollutionData);
      handleSideBarCollapse();
      setInitialState();
    })
    .catch(error => console.error('Error fetching data:', error));
});

function initializeHeatMap(pollutionData){
  const blur = 1;
  const radius = 25;
  const maxPollution = 100;
  let context = 0;
  // Convert the values to points & weights
  const features = pollutionData.map(item => {
    context++;
    console.log(`Processing: Lat: ${item.lat}, Lng: ${item.lng}, Pollution: ${item.pollution}`);
    const feature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([item.lng, item.lat])),
      weight: item.pollution / maxPollution, // Normalization
    });
    return feature;
  });

  console.log(context);
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
      zoom: 12,
    }),
  });  
}

function handleSideBarCollapse() {
  var myCollapseElements = document.querySelectorAll('.collapse');
  myCollapseElements.forEach(function (collapseEl) {
    collapseEl.addEventListener('show.bs.collapse', function () {

      // Open
      myCollapseElements.forEach(function (el) {
        if (el !== collapseEl) {
          var collapseInstance = bootstrap.Collapse.getInstance(el);
          collapseInstance && collapseInstance.hide();
        }
      });

      // Highlight 
      var actives = document.querySelectorAll('.nav-link.active');
      actives.forEach(function (active) {
        active.classList.remove('active');
      });
      var navLink = document.querySelector('[href="#' + collapseEl.id + '"]');
      navLink && navLink.classList.add('active');
    });
  });
}

function setInitialState() {
  // Details should be active, by default
  var detailsNavLink = document.querySelector('.nav-link[href="#detailsContent"]');
  if (detailsNavLink) {
    detailsNavLink.classList.add('active');
  }

  // Show the content
  var detailsCollapse = document.getElementById('detailsContent');
  if (detailsCollapse) {
    var collapseInstance = new bootstrap.Collapse(detailsCollapse, {
      toggle: false // It automatically closes when the page is displayed without disabling the toggle
    });
    collapseInstance.show();
  }
}