import {maxPollution } from './configES6.js';

document.addEventListener("DOMContentLoaded", function(){
  fetch('/pollution') 
    .then(response => response.json())
    .then(pollutionData => {
      let map = initializeHeatMap(pollutionData.processedData);
      handleTooltip(map);
      updateStatistics(pollutionData.averagePollutionByCompany);
      handleSideBarCollapse();
      setInitialState();
    })
    .catch(error => console.error('Error fetching data:', error));
});

export function initializeHeatMap(pollutionData){
  const blur = 1;
  const radius = 25;
  // Convert the values to points & weights
  const features = pollutionData.map(item => {
    const feature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([item.lng, item.lat])),
      weight: item.pollution / maxPollution, // Normalization
      companyName: item.companyName, // To show in the tooltip
      pollutionHistory: item.pollutionHistory
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
      zoom: 12,
    }),
  });  
  return map;
}

export function handleTooltip(map){
  const tooltipElement = document.getElementById('tooltip');
  const tooltipOverlay = new ol.Overlay({
    element: tooltipElement,
    offset: [10, 0],
    positioning: 'bottom-left'
  });
  map.addOverlay(tooltipOverlay);

  // Add hover interaction
  map.on('pointermove', function(evt) {
    const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
      return feature;
    });

    if (feature) {
      let companyName = feature.get('companyName');
      let pollutionLevel = feature.get('weight') * maxPollution; 
      let pollutionHistory = feature.get('pollutionHistory');
  
      let tooltipContent = `Responsible company: ${companyName}<br>Pollution level: ${pollutionLevel.toFixed(2)} out of ${maxPollution}`;
      
      if (pollutionHistory && pollutionHistory.length > 1) {
        let lastReading = pollutionHistory[pollutionHistory.length - 1];
        let secondLastReading = pollutionHistory[pollutionHistory.length - 2];
  
        let change = ((lastReading - secondLastReading) / secondLastReading) * 100;
        let arrow = change >= 0 ? '⬆' : '⬇'; 
        let color = change >= 0 ? 'red' : 'green';
  
        tooltipContent += `<br><span style="color: ${color};">${arrow} ${Math.abs(change.toFixed(2))}%</span>`;
      }

      tooltipElement.innerHTML = tooltipContent;
      tooltipOverlay.setPosition(evt.coordinate);
      tooltipElement.style.display = 'block';
    } else {
      tooltipElement.style.display = 'none';
    }
  });
}
export function handleSideBarCollapse() {
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

export function setInitialState() {
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

export function updateStatistics(averagePollutionData) {
  const historyContentElement = document.getElementById('historyContent');
  let content = '<div class="p-3">';

  for (let companyName in averagePollutionData) {
    let avgPollution = averagePollutionData[companyName].toFixed(2);
    content += `<p><strong>${companyName}:</strong> Average Pollution - ${avgPollution}</p>`;
  }

  content += '</div>';
  historyContentElement.innerHTML = content;
}