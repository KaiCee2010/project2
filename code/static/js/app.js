
var flameIcon = L.Icon.extend({
  options: {
      shadowUrl: 'static/images/flame_shadow.png',
      iconSize:     [10, 30],
      shadowSize:   [10, 30],
      iconAnchor:   [5, 30],
      shadowAnchor: [6, 31],
      popupAnchor:  [-3, -76]
  }
});

var flame1Icon = new flameIcon({iconUrl: 'static/images/flame1.png'}),
  flame2Icon = new flameIcon({iconUrl: 'static/images/flame2.png'}),
  flame3Icon = new flameIcon({iconUrl: 'static/images/flame3.png'}),
  flame4Icon = new flameIcon({iconUrl: 'static/images/flame4.png'}),
  flame5Icon = new flameIcon({iconUrl: 'static/images/flame5.png'});

  L.icon = function (options) {
    return new L.Icon(options);
};


var slider = new rSlider({
  target: '#slider',
  // values: [2010, 2011, 2012, 2013, 2014, 2015],
  values: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015],
  range: true,
  set: [2007, 2007],
  onChange: function(vals){
    addMarkers(vals)
  }

});


var myMap = L.map("map", {
<<<<<<< HEAD
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
=======
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
  
  
  var markers = L.layerGroup()


  var vals = slider.getValue()

  var link = "../static/data/us_states_500k.json"
  
  function addMarkers(vals){
  // Add a marker to the map for each crime
  Promise.all([d3.json("/data"), d3.json("/state")]).then(function(response){
    
    console.log(response[0])
>>>>>>> c59021e94920407886eda9d5ad2737d63b6e44c9

    markers.clearLayers();

    years = vals.split(",")
    year1 = parseInt(years[0])
    year2 = parseInt(years[1])
   

<<<<<<< HEAD
    // console.log("latitude", latitude)
    // console.log("longitude", longitude)

    if (latitude || longitude) {
      L.marker([latitude, longitude]).addTo(myMap);
    }
  });
});
=======
    console.log(year1, year2)

    var filteredData = response[0].filter(function(data) {
      return data.fire_year >= year1  && data.fire_year <= year2;
    })
  
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

        if (latitude || longitude){
                var marker = L.marker([latitude, longitude],{
                icon: mapIcon
            }).bindPopup(`<h3>${data.fire_name}</h3> <hr> 
            <h5>Status: ${data.fire_year}}`);

            markers.addLayer(marker);
        }
    });

    myMap.addLayer(markers)
       

    var top10Fires = filteredData.filter(function(d, i){
      return i<10
    })

    console.log(top10Fires)

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

    var trace1 = {
      x: topFiresSize,
      y: topFiresName,
      name: topFiresID,
      type: "bar",
      orientation: "h",
      text: `topFiresID`,
      opacity: 0.5,
      marker: {
      color: 'rgb(158,202,225)',
      line: {
        color: 'rgb(8,48,107)',
        width: 1.5
      }
    }
      
    };

    var plotData = [trace1]

    console.log("for plot title", year1, year2)
    if (year1 === year2){
      var titleText = `Top Ten Fires ${year1}`
    }
    else {
      var titleText = `Top Ten Fires ${year1} - ${year2}`
    }


    var layout = {
        title: titleText,
        margin: {
          l: 50,
          r: 50,
          b: 100,
          t: 100,
          pad: 4
        },
        paper_bgcolor: '#7f7f7f',
        plot_bgcolor: '#c7c7c7',
        xaxis: {
            title:"Number of Acres",
            range: [0, 700000],
            automargin: true,
            
        },
        yaxis: {
            title: "Fire Name",
            autorange:'reversed',
            type: "category",
            automargin: true,

          
        }
      };
    
    Plotly.newPlot("bar", plotData, layout)


    var svgArea = d3.select("#scatter").select("svg");

    // clear svg is not empty
    if (!svgArea.empty()) {
    svgArea.remove();
    }
    
    svgWidth = document.getElementById('scatter').clientWidth;
    svgHeight = svgWidth / 1.45;
    
    var border=1;
    var bordercolor='gray';

    // Append SVG element
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth)
        .attr("border", border);

    //create the border for the object
    var borderPath = svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", svgHeight)
        .attr("width", svgWidth)
        .style("stroke", bordercolor)
        .style("fill", "none")
        .style("stroke-width", border);

    //create the margins for the plot
    var margin = {
        top: 75,
        bottom: 75,
        right: 75,
        left: 75
    };

    //calculate the chart width and height
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;

    // Append group element
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);



      //calculate the scales
      var xScale = d3.scaleLinear()
      .domain([d3.min(filteredData, d => d.burning_days)/1.35, d3.max(filteredData, d => d.burning_days)*1.15])
      .range([0, chartWidth]);

      var yScale = d3.scaleLinear()
      .domain([d3.min(filteredData, d => d.fire_size)/5, d3.max(filteredData, d => d.fire_size)*1.35])
      .range([chartHeight, 0]);

      // create axes
      var xAxis = d3.axisBottom(xScale).ticks(6);
      var yAxis = d3.axisLeft(yScale).ticks(6);

      // append axes
      chartGroup.append("g")
          .attr("transform", `translate(0, ${chartHeight})`)
          .call(xAxis);

      chartGroup.append("g")
          .call(yAxis);

      var radius = 10

      // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
      // Its opacity is set to 0: we don't see it by default.
      var tooltip = d3.select("#scatter")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")


      // A function that change this tooltip when the user hover a point.
      // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
      var mouseover = function(d) {
        tooltip
          .style("opacity", 1)
      }

      var mousemove = function(d) {
        tooltip
          .html("The exact value of<br>the Ground Living area is: " + d.fire_size)
          .style("left", d3.select(this).attr("cx") + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
          .style("top", d3.select(this).attr("cy") + "px")
      }

      // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
      var mouseleave = function(d) {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0)
  }




      //create the circles
      var circlesGroup = chartGroup.append("g")
      .selectAll("circle")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("class", "fireCircle")
      .attr("cx", d => xScale(d.burning_days))
      .attr("cy", d => yScale(d.fire_size))
      .attr("r",  15)
      .on("mouseover", onMouse(filteredData) )
      .on("mousemove", mousemove )
      .on("mouseleave", mouseleave )
      

    

      // // Create axes labels
      // chartGroup.append("text")
      // .attr("transform", "rotate(-90)")
      // .attr("y", 0 - margin.left)
      // .attr("x", 0 - (chartHeight / 2))
      // .attr("dy", "1em")
      // .attr("class", "axisText")
      // .attr("font-weight", "bold")
      // .text("Fire Size");


      // chartGroup.append("text")
      // .attr("transform", `translate(${(chartWidth / 2)- 80}, ${chartHeight + margin.top - 30})`)
      // .attr("class", "axisText")
      // .attr("font-weight", "bold")
      // .text("Days Before Contained");
      
      // //create the tooltips
      // var toolTip = d3.tip()
      // .attr("class", "d3-tip") //toolTip doesn't have a "classed()" function like core d3 uses to add classes, so we use the attr() method.
      // .offset([80, 50]) // (vertical, horizontal)
      // .html(function(d) {
      //     return (`${d.fire_year}<br>Poverty: ${d.fire_size}%
      //     <br>Healthcare: ${d.burning_days}%`);
      // });
          
      // // Create the tooltip in chartGroup.
      // circlesGroup.call(toolTip);

      // //Create "mouseover" event listener to display tooltip
      // circlesGroup.on("mouseover", function(d) {
      //     toolTip.show(d, this);
      // })
      
      // //Create "mouseout" event listener to hide tooltip
      //     .on("mouseout", function(d) {
      //     toolTip.hide(d);
      //     });
              

  }).catch(function(error) {
      console.log(error);
  });

    


}

>>>>>>> c59021e94920407886eda9d5ad2737d63b6e44c9
