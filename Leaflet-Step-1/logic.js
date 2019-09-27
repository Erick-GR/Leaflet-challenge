var myMap = L.map("map", {
  center: [39.040528, -100.962505],
  zoom: 3
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
var url_week = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var url_all = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(url_all, function(response) {
  console.log(response.features);

  var length = response.features.length;
  var res = response.features;

  for (var i = 0; i < length; i++) {
    var location = [res[i].geometry.coordinates[1], res[i].geometry.coordinates[0]];
    var mag = res[i].properties.mag;

    if (mag < 1){
      L.circle(location, {
        color: "green",
        fillColor: "green",
        radius: mag * 10000
      }).bindPopup(`${res[i].properties.place}<br>Magnitude: <b>${res[i].properties.mag}</b>`).addTo(myMap);
    } else if (mag < 2) {
      L.circle(location, {
        color: "#a3ff00",
        fillColor: "#a3ff00",
        radius: mag * 10000
      }).bindPopup(`${res[i].properties.place}<br>Magnitude: <b>${res[i].properties.mag}</b>`).addTo(myMap);
    } else if (mag < 3) {
      L.circle(location, {
        color: "#f4ff49",
        fillColor: "#f4ff49",
        radius: mag * 10000
      }).bindPopup(`${res[i].properties.place}<br>Magnitude: <b>${res[i].properties.mag}</b>`).addTo(myMap);
    } else if (mag < 4) {
      L.circle(location, {
        color: "#ffce00",
        fillColor: "#ffce00",
        radius: mag * 10000
      }).bindPopup(`${res[i].properties.place}<br>Magnitude: <b>${res[i].properties.mag}</b>`).addTo(myMap);
    }  else if (mag < 5) {
      L.circle(location, {
        color: "orange",
        fillColor: "orange",
        radius: mag * 10000
      }).bindPopup(`${res[i].properties.place}<br>Magnitude: <b>${res[i].properties.mag}</b>`).addTo(myMap);
    }
    else {
      L.circle(location, {
        color: "red",
        fillColor: "red",
        radius: mag * 10000
      }).bindPopup(`${res[i].properties.place}<br>Magnitude: <b>${res[i].properties.mag}</b>`).addTo(myMap);
    }

  }
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'legend');

  div.innerHTML += "<h4>Earthquake Magnitude</h4>";
  div.innerHTML += '<i style="background: green"></i><span>0-1</span><br>';
  div.innerHTML += '<i style="background: #a3ff00"></i><span>1-2</span><br>';
  div.innerHTML += '<i style="background: #f4ff49"></i><span>2-3</span><br>';
  div.innerHTML += '<i style="background: yellow"></i><span>3-4</span><br>';
  div.innerHTML += '<i style="background: orange"></i><span>4-5</span><br>';
  div.innerHTML += '<i style="background: red"></i><span>5 ></span><br>';

  return div;
};

legend.addTo(myMap);
