console.log("Just testing");

var myMap = L.map("map", {
  center: [44.53155795563836, -102.61109623371827],
  zoom: 4
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


d3.json("/data").then(function (response) {
  console.log(response)

  response.forEach(function (data) {
    var latitude = parseFloat(data.latitude)
    var longitude = parseFloat(data.longitude)



    // console.log("latitude", latitude)
    // console.log("longitude", longitude)

    if (latitude || longitude) {
      L.marker([latitude, longitude]).addTo(myMap);
    }
  });
});