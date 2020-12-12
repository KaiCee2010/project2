//Let's get after it

//Create funtion for option change

optionChanged()

function optionChanged() {

	//Read all the datasets
	Promise.all([d3.json("/stcty"), d3.json("/cause"), d3.json("/totalstate"), d3.json("/data") ]).then(function(fireData){
		
		
		//remove the bar chart if it exists, so it can be recreated
		d3.select("#myBarChart").remove()
              
		
		console.log("firedata", fireData[0])

		//Save the state abbreviation to a variable
		var abbr = fireData[0].map(function(d){
			return d.abbr
		})
		
		//Find unique state values
		var unique = abbr.filter(onlyUnique)	
		console.log("state names", unique)

		
		//Add state values to the dropdown
		d3.select("#selDataset")
			.selectAll("option")
			.data(unique)
			.enter()
			.append("option")
			.html(function(d) {
				return `${d}`;
			});
		
		//Grab the dropdown value and save it to a variable
		var sel = document.getElementById('selDataset');
		var sel_val = sel.options[sel.selectedIndex].value
		console.log(sel_val)
		
		//filter the data by the state abbr
		var statefiltered = fireData[0].filter(function(data) {
            return String(data.abbr) === sel_val;
        });

		console.log("state filtered", statefiltered)
		

		//CREATING CHART JS BAR CHART FOR COUNTY TOTALS
		/////////////////////////////////////////
		/////////////////////////////////////////
		
		
		//Create to variables to save out counties and fire totals.
		var name = []
		var count = []
		

		var name =  statefiltered.map(function(d){
			return d.county
		});

		var count =  statefiltered.map(function(d){
			return d.total_fires
		});

	
		//Add the canvas back to the html
		d3.select("#canvasBarChart")
		.append("canvas")
		.attr("id", "myBarChart")
		

		//Create the bar chart for state totals
		var ctx = document.getElementById('myBarChart').getContext('2d');
		var myBarchart = new Chart(ctx, {
			// The type of chart we want to create
			type: 'bar',

			// The data for our dataset
			data: {
				labels: name,
				datasets: [{
					label: `Number of Fires By County - ${sel_val}`,
					backgroundColor: 'orange',
					borderColor: 'orange',
					data: count
				}]
			},

			// Configuration options go here
			options: {scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			}}
		});


		//CREATING CHART JS BAR CHART FOR CAUSE TOTALS
		/////////////////////////////////////////
		/////////////////////////////////////////

		//If cause bar chart exists, blast it away
		d3.select("#myBarChart2").remove()

		//Filter the cause dataset
		var statefilteredCause = fireData[1].filter(function(data) {
			return String(data.state) === sel_val;
		});
	
		console.log("state filtered", statefiltered)


		//Save cause and cause count data to variables
		var cause =  statefilteredCause.map(function(d){
			return d.cause
		});

		var causeCount =  statefilteredCause.map(function(d){
			return d.total_causes
		});


		console.log("cause", cause)
		console.log("cause count", causeCount)


		//Add the cause chart canvas back to the html
		d3.select("#canvasBarChart2")
			.append("canvas")
			.attr("id", "myBarChart2")	

		
		//Create cause bar chart	
		var ctxBar2 = document.getElementById('myBarChart2').getContext('2d');
		var myBarChart2 = new Chart(ctxBar2, {
			// The type of chart we want to create
			type: 'bar',
		
			// The data for our dataset
			data: {
				labels: cause,
				datasets: [{
					label: `Number of Fires By Cause - ${sel_val}`,
					backgroundColor: '#dbba1b',
					borderColor: '#dbba1b',
					data: causeCount
				}]
			},
		
			// Configuration options go here
			options: {chartArea: {
				backgroundColor: 'rgba(251, 85, 85, 0.4)'
			},
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			}}
		});
	

		
		//CREATING PLOTLY CHOROPLETH MAP
		/////////////////////////////////////////
		/////////////////////////////////////////

		
		//Grab state and total fire data
		var states =  fireData[2].map(function(d){
			return d.state
		});

		var total_fires =  fireData[2].map(function(d){
			return d.total_fires
		});
		console.log(states)
		console.log(total_fires)

		//Call getVals function to get latitude, longitude, and zoom
		//level for map refresh
		var choroVals = getVals(sel_val)

		console.log(choroVals)
		console.log("lat", choroVals.lat)
		console.log("long", choroVals.long)
		
		
		//Create choropleth map
		var data = [{
				type: "choroplethmapbox", locations: states, z: total_fires,
				colorscale: "Hot", 
				reversescale: true,
				marker: {opacity: .75},
				geojson: "https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json"
			}];
			
			var layout = {mapbox: {center: {lon: choroVals.long, lat: choroVals.lat}, 
							style: 'light',
							zoom: choroVals.zoom},
							width: 600, height:400,
							margin: {
								l: 5,
								r: 5,
								b: 15,
								t: 15,
								pad: 4
							  }
							};
			
		var config = {mapboxAccessToken: API_KEY};
		
		Plotly.newPlot('myDiv', data, layout, config);


		//CREATING PLOTLY HORIZONTAL BAR CHART FOR TOP TEN
		/////////////////////////////////////////
		/////////////////////////////////////////

		//Filter dataset by state
		var statefilteredTop = fireData[3].filter(function(data) {
			return String(data.state) === sel_val;
		});

		console.log("statefiltered top", statefilteredTop)

		//Grap the top ten fires
		var top10Fires = statefilteredTop.filter(function(d, i){
			return i<10
			})
		
		console.log("top 10 fires", top10Fires)


		//Save fire size, name and fire id to variables	
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


		//Create the plot horizonatl bar chart		
			var trace1 = {
			x: topFiresSize,
			y: topFiresName,
			name: topFiresID,
			type: "bar",
			orientation: "h",
			text: `Acres Effected`,
			opacity: 1,
			marker: {
			color: '#bc0f0f',
			line: {
				color: '#bc0f0f',
				width: 1.5
			}
			}
			
			};
		
			var plotData = [trace1]
		  
		  
			  var layout = {
				  title: `<b>Top Ten Fires<br>State: ${sel_val}</b>`,
				  titlefont: {
					size: 24,
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
					  title:"<b>Number of Acres</b>",
					  titlefont: {
						size: 20,
						color: '2d2d2d'
					  },
					  range: [0, 700000],
					  automargin: true,
					  
				  },
				  yaxis: {
					  title: "<b>Fire Name</b>", 
					  titlefont: {
						size: 20,
						color: '2d2d2d'
					  },
					  autorange:'reversed',
					  type: "category",
					  automargin: true,
		  
					
				  }
				};
			  
			  Plotly.newPlot("myBar", plotData, layout)
	


}).catch(function(error) {
	console.log(error);
});

}


//Unique function
function onlyUnique(value,index, self) {
	return self.indexOf(value) === index;	
}



//getVals function to get center of state and zoom level for choropleth map
function getVals(sel_val){
	if (sel_val === "AK"){
		var lat = 63.588753
		var long = -154.493062
		var zoom = 2.5
	}
	else if (sel_val === "AL"){
		var lat = 32.318231
		var long = -86.902298
		var zoom = 5
	}
	else if (sel_val === "AR"){
		var lat = 35.20105
		var long = -91.831833
		var zoom = 5.4
	}
	else if (sel_val === "AZ"){
		var lat = 34.048928
		var long = -111.093731
		var zoom = 5
	}
	else if (sel_val === "CA"){
		var lat = 37.778261
		var long = -119.417932
		var zoom = 4.3
	}
	else if (sel_val === "CO"){
		var lat = 39.050051
		var long = -105.782067
		var zoom = 5
	}
	else if (sel_val === "FL"){
		var lat = 27.664827
		var long = -82.515754
		var zoom = 5
	}
	else if (sel_val === "GA"){
		var lat = 33.157435
		var long = -83.907123
		var zoom = 5.3
	}
	else if (sel_val === "ID"){
		var lat = 45.568202
		var long = -114.742041
		var zoom = 4.5

	}
	else if (sel_val === "KS"){
		var lat = 39.011902

		var long = -98.484246
		var zoom = 5.3

	}
	else if (sel_val === "LA"){
		var lat = 31.244823

		var long = -92.145024
		var zoom = 5.7

	}
	else if (sel_val === "MI"){
		var lat = 44.314844

		var long = -85.602364
		var zoom = 5

	}
	else if (sel_val === "MN"){
		var lat = 46.729553

		var long = -94.6859
		var zoom = 4.8

	}
	else if (sel_val === "MS"){
		var lat = 32.354668

		var long = -89.398528
		var zoom = 5.3

	}
	else if (sel_val === "MT"){
		var lat = 46.879682

		var long = -110.362566
		var zoom = 4.7

	}
	else if (sel_val === "NC"){
		var lat = 35.759573

		var long = -79.0193
		var zoom = 5

	}
	else if (sel_val === "NM"){
		var lat = 33.97273
		var long = -106.032363
		var zoom = 5

	}
	else if (sel_val === "NE"){
		var lat = 41.492537

		var long = -99.901813

		var zoom = 5.2
	}
	else if (sel_val === "NV"){
		var lat = 38.80261

		var long = -116.419389

		var zoom = 4.8
	}

	else if (sel_val === "OK"){
		var lat = 36.007752

		var long = -98.412877
		var zoom = 5.2

	}
	else if (sel_val === "OR"){
		var lat = 43.804133

		var long = -120.554201
		var zoom = 5.2

	}
	else if (sel_val === "SD"){
		var lat = 44.969515

		var long = -100.201813
		var zoom = 5.2

	}
	else if (sel_val === "TX"){
		var lat = 31.568599

		var long = -99.901813
		var zoom = 4.3


	}
	else if (sel_val === "UT"){
		var lat = 39.32098

		var long = -111.093731

		var zoom = 5.1

	}
	else if (sel_val === "VA"){
		var lat = 37.931573

		var long = -78.956894
		var zoom = 5.2

	}
	else if (sel_val === "WA"){
		var lat = 47.751074

		var long = -120.740139
		var zoom = 5.2

	}
	else if (sel_val === "WV"){
		var lat = 38.597626

		var long = -80.454903
		var zoom = 5.4

	}
	else if (sel_val === "WY"){
		var lat = 43.075968

		var long = -107.290284
		var zoom = 5.3

	}
	else {
		var lat = 44.53155795563836
		var long = -102.61109623371827
		var zoom = 1
	}
	return {lat, long, zoom}

	}

