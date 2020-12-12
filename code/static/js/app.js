//HERE WE GO!!

//Set options for custom markers
var flameIcon = L.Icon.extend({
  options: {
      shadowUrl: 'static/images/flame_shadow.png',
      iconSize:     [10, 30],
      shadowSize:   [10, 30],
      iconAnchor:   [5, 30],
      shadowAnchor: [6, 31],
      popupAnchor:  [0, -10]
  }
});

//Set path for custom marker images
var flame1Icon = new flameIcon({iconUrl: 'static/images/flame1.png'}),
  flame2Icon = new flameIcon({iconUrl: 'static/images/flame2.png'}),
  flame3Icon = new flameIcon({iconUrl: 'static/images/flame3.png'}),
  flame4Icon = new flameIcon({iconUrl: 'static/images/flame4.png'}),
  flame5Icon = new flameIcon({iconUrl: 'static/images/flame5.png'});

  L.icon = function (options) {
    return new L.Icon(options);
};


//Create the year slider
var slider = new rSlider({
  target: '#slider',
  // values: [2010, 2011, 2012, 2013, 2014, 2015],
  values: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015],
  range: true,
  set: [2007, 2007],
  onChange: function(vals){
    //call the add markers function every time the slider changes.
    //Pass vals to it
    addMarkers(vals)
  }

});

//Create the leaflet map
var myMap = L.map("map", {
    center: [39.78394, -97.36682],
    zoom: 4
  });
  
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  }).addTo(myMap);
  
  
  //Save the values for the slider
  var vals = slider.getValue()

  //Create a variable layergroup so it can be destroyed.
  var markers = L.layerGroup()


  //Creating legend only needs to happen once, build it outside of function
  //Add it to the map
  var legend = L.control({position: 'bottomright', opacity: 1});
  legend.onAdd = function (myMap) {

      var div = L.DomUtil.create('div', 'info legend'),
      depthArray = [0, 50000, 100000, 250000, 500000],
      labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < depthArray.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(depthArray[i] + 1) + '  "></i> ' + '&nbsp&nbsp&nbsp' +
              depthArray[i] + (depthArray[i + 1] ? '&ndash;' + depthArray[i + 1] + '<br>' : '+');
      }

      return div;
  };

  legend.addTo(myMap)

  
  
  function addMarkers(vals){
  // Add a marker to the map for each crime
  

  //Get my json response
  d3.json("/data").then(function(response){    

    console.log(response)

    //clear all the markers before we recreate them
    markers.clearLayers();

    var years = vals.split(",")
    var year1 = years[0]
    var year2 = years[1]
   

    console.log(year1, year2)

    //Filter the response by years
    var filteredData = response.filter(function(data) {
      return data.fire_year >= year1  && data.fire_year <= year2;
    })
  
    //For each item, grab latitude, longitude, and size.
    //Also set the mapIcon based on size
    filteredData.forEach(function(data){
        
        var latitude = data.latitude
        var longitude = data.longitude
        var size = data.fire_size


        if (size >500000){
          var mapIcon = flame5Icon
        }
        else if (size >250000){
          var mapIcon = flame4Icon
        }
        else if (size >100000){
          var mapIcon = flame3Icon
        }
        else if (size >50000){
          var mapIcon = flame2Icon
        }
        else {
          var mapIcon = flame1Icon
        }

        //Check if lat/long exists, if so create the marker
        if (latitude || longitude){
                var marker = L.marker([latitude, longitude],{
                icon: mapIcon
            }).bindPopup(`<b>${data.fire_name}</b><hr> 
            Year: ${data.fire_year}<br>Size: ${data.fire_size} Acres`);

            //Add marker to the markers layergroup
            markers.addLayer(marker);
        }
    });

    //Add markers layer to the map
    myMap.addLayer(markers)

      

    //CREATING PLOTLY TOP 10 BAR CHART
    //////////////////////////////////
    //////////////////////////////////

    //Save top 10 fires from filtered data to a variable
    var top10Fires = filteredData.filter(function(d, i){
      return i<10
    })

    console.log(top10Fires)

    //Save the size, name, and fire id to individual variables
    var topFiresSize =  top10Fires.map(function(d){
      return d.fire_size
    });

    var topFiresName =  top10Fires.map(function(d){
      return d.fire_name
    });

    var topFiresID =  top10Fires.map(function(d){
      return d.fod_id
    });

    console.log("topFireSize", topFiresSize)
    console.log("topFireName", topFiresName)

    
    //Create the bar chart
    var trace1 = {
      x: topFiresSize,
      y: topFiresName,
      name: topFiresID,
      type: "bar",
      orientation: "h",
      text: "Number of Acres",
      marker: {
      color: '#ba0b0b',
      line: {
        color: '#ba0b0b',
        width: 1.5
      }
    }
      
    };


    var plotData = [trace1]

    console.log("for plot title", year1, year2)
    if (year1 === year2){
      var titleText = `<b>Top Ten Fires ${year1}</b>`
    }
    else {
      var titleText = `<b>Top Ten Fires ${year1} - ${year2}</b>`
    }


    var layout = {
        title: titleText,
        titlefont: {
					size: 20,
					color: '2d2d2d'
				  },
        margin: {
          l: 50,
          r: 50,
          b: 100,
          t: 100,
          pad: 4
        },
        plot_bgcolor: 'white',
        xaxis: {
            title:"<b>Acres Affected</b>",
            titlefont: {
              size: 18,
              color: '2d2d2d'
              },
            range: [0, 700000],
            automargin: true,
            
        },
        yaxis: {
            title: "<b>Fire Name</b>",
            titlefont: {
              size: 18,
              color: '2d2d2d'
              },
            autorange:'reversed',
            type: "category",
            automargin: true,

          
        }
      };


    
    Plotly.newPlot("bar", plotData, layout) 



    ///CREATING A CHART JS SCATTER PLOT
    //////////////////////////////////
    /////////////////////////////////

    //Blast away the scatter plot if it exists
    d3.select("#scatter").remove()

    
    //Add a fresh clean on back to the html
    d3.select("#canvasScatterChart")
    .append("canvas")
    .attr("id", "scatter")
    
    
    //Grab burning_days and fire_size and save it to a variable
    var scatterData = filteredData.map(function(d){
      return { 
        x: d.burning_days,
        y: d.fire_size,

      }
    })

    //Grab name and fire year and save it to a variable
    var scatterDataLabels = filteredData.map(function(d){
      return [d.fire_name, d.fire_year]
    })


    console.log("scatterData", scatterData)
    console.log("names", scatterDataLabels)
    

    //Create the scatter plot
    var ctxScatter = document.getElementById('scatter').getContext('2d');

    var scatterChart = new Chart(ctxScatter, {
      type: 'scatter',
      data: {
          labels: scatterDataLabels,
          datasets: [{
              label: 'Fire Size vs. Days Before Contained',

              backgroundColor: '#ff8827',
              borderColor: '#898888',
              pointRadius: 8,
              data: scatterData
          }]
      },
      options: {
        tooltips: {
          callbacks: {
              label: function(tooltipItem, data) {
                var label = data.labels[tooltipItem.index];
                return [label[0], "Year: " + label[1], "Wildfire Size: " + tooltipItem.xLabel, "Days Before Contained: " + tooltipItem.yLabel]
              }
          }
        },
          scales: {
              xAxes: [{
                  type: 'linear',
                  position: 'bottom'
              }]
          }
      }
    });



  }).catch(function(error) {
      console.log(error);
  });

}

//Get color function for legend
function getColor(d){
  return d > 500000 ? '#770505' :
         d > 250000 ? '#ba0b0b' :
         d > 100000 ? '#d24f2b' :
         d > 50000 ? '#dc761d' :
         d > 0 ? '#f2ba28' :
                      '#f2ba28' ;
         
}

