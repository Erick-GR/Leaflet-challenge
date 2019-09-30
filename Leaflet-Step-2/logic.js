var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
var url_week = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var url_all = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

var platesJson = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

function getData() {
  d3.json(url_all, function(response) {
    // console.log(response.features);

    var length = response.features.length;
    var res = response.features;

    var eqMarkers = [];

    for (var i = 0; i < length; i++) {
      var location = [res[i].geometry.coordinates[1], res[i].geometry.coordinates[0]];
      var mag = res[i].properties.mag;

      eqMarkers.push(L.circle(location, {
        color: selectColor(mag),
        fillColor: selectColor(mag),
        radius: mag * 30000
      }).bindPopup(`${res[i].properties.place}<br>Magnitude: <b>${res[i].properties.mag}</b>`));
    }

    d3.json(platesJson, function(plates) {
      console.log(plates);

      function onEachFaultLine(feature, layer) {
        L.polyline(feature.geometry.coordinates);
      }

      var faultLines = L.geoJSON(plates.features, {
        style: {
          color: 'purple',
          weight: 2
        },
        onEachFeature: onEachFaultLine
      });

      buildLayers(eqMarkers, faultLines);
    });
  });
}

function selectColor(mag) {
  if (mag < 1) {
    return "green";
  } else if (mag < 2) {
    return "#a3ff00";
  } else if (mag < 3) {
    return "#f4ff49";
  } else if (mag < 4) {
    return "#ffce00";
  } else if (mag < 5) {
    return "orange";
  } else {
    return "red";
  }
}

function buildLayers(eqMarkers, faultLines) {
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var eqLayer = L.layerGroup(eqMarkers);

  var baseMaps = {
    Light: streetmap,
    Satellite: satellite,
    Dark: darkmap
  };

  var overlayMaps = {
    Earthquakes: eqLayer,
    "Fault Lines": faultLines
  };

  buildMap(streetmap, eqLayer, faultLines, baseMaps, overlayMaps);
}

function buildMap(streetmap, eqLayer, faultLines, baseMaps, overlayMaps) {
  var myMap = L.map("map", {
    center: [39.040528, -100.962505],
    zoom: 3,
    layers: [streetmap, eqLayer, faultLines]
  });

  L.control.layers(baseMaps, overlayMaps).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'legend');

    div.innerHTML += "<h4>EQ Mag</h4>";
    div.innerHTML += '<i style="background: green"></i><span>0-1</span><br>';
    div.innerHTML += '<i style="background: #a3ff00"></i><span>1-2</span><br>';
    div.innerHTML += '<i style="background: #f4ff49"></i><span>2-3</span><br>';
    div.innerHTML += '<i style="background: yellow"></i><span>3-4</span><br>';
    div.innerHTML += '<i style="background: orange"></i><span>4-5</span><br>';
    div.innerHTML += '<i style="background: red"></i><span>5 ></span><br>';

    return div;
  };

  legend.addTo(myMap);
}

getData();
