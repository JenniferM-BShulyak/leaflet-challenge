// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.


  createFeatures(data.features);

});


function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><hr><p>Magnitude:${(feature.properties.mag)}</p><hr><p>Depth: ${(feature.geometry.coordinates[2])}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    "onEachFeature": onEachFeature, 
    style: styleInfo,
    pointToLayer : function(feature, latlng) {
      return L.circle(latlng, feature.properties.mag*20000);
  }
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}
function getColor(depth){
  if (depth > 90) {
    return "red";
  }else if (depth > 70) {
    return "orange";
  }else if (depth > 50) {
    return "yellow";
  }else if (depth > 30) {
    return "green";
  }else if (depth > 10) {
    return "blue"
  }else {
    return "purple";
  }
};

// Color Function
function styleInfo(feature){
  var depth = feature.geometry.coordinates[2];
  return {
    color: getColor(depth)
  
  };
}; 



function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });


  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
  
  
 
  // Set up the legend.
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = ['-10-10','10-30','30-50','50-70','70-90', '>90'];
    var colors = ["red", "orange", "yellow", "green", "blue", "purple"];
    var labels = [];
  // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };
  // Adding the legend to the map
  legend.addTo(myMap);

  //   // Add the minimum and maximum.
  //   var legendInfo = "<h1>Depth of Earthquake</h1>" +
  //       "<div class=\"labels\">" +
  //         "<div class=\"min\">" + limits[0] + "</div>" +
  //         "<div>" + limits[1] + "</div>" +
  //         "<div>" + limits[2] + "</div>" +
  //         "<div>" + limits[3] + "</div>" +
  //         "<div>" + limits[4] + "</div>" +
  //         "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
  //       "</div>";
  
  //   div.innerHTML = legendInfo;
  
  //   limits.forEach(function(limit, index) {
  //       labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
  //     });
  
  //   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  //   return div;
  // };
  
  
};


