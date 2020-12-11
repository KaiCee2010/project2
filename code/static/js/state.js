



optionChanged()

function optionChanged() {

	Promise.all([d3.json("/stcty"), d3.json("/cause"), d3.json("/totalstate"), d3.json("/data") ]).then(function(fireData){
		
		d3.select("#myBarChart").remove()
        
        
		
		console.log("firedata", fireData[0])
		
		var abbr = fireData[0].map(function(d){
			return d.abbr
		})
		
		var unique = abbr.filter(onlyUnique)
				
		console.log("state names", unique)
		
		d3.select("#selDataset")
			.selectAll("option")
			.data(unique)
			.enter()
			.append("option")
			.html(function(d) {
				return `${d}`;
			});
		
		var sel = document.getElementById('selDataset');
		var sel_val = sel.options[sel.selectedIndex].value
		console.log(sel_val)
		
		
		var statefiltered = fireData[0].filter(function(data) {
            return String(data.abbr) === sel_val;
        });

		console.log("state filtered", statefiltered)
		
		var name = []
		var count = []
		

		var name =  statefiltered.map(function(d){
			return d.county
		});

		var count =  statefiltered.map(function(d){
			return d.total_fires
		});

	
		d3.select("#canvasBarChart")
		.append("canvas")
		.attr("id", "myBarChart")
		
		var ctx = document.getElementById('myBarChart').getContext('2d');
	
	
		var myBarchart = new Chart(ctx, {
			// The type of chart we want to create
			type: 'bar',

			// The data for our dataset
			data: {
				labels: name,
				datasets: [{
					label: `Number of Fires By County - ${sel_val}`,
					backgroundColor: 'rgb(255, 99, 132)',
					borderColor: 'rgb(255, 99, 132)',
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


		d3.select("#myBarChart2").remove()

		var statefilteredCause = fireData[1].filter(function(data) {
			return String(data.state) === sel_val;
		});
	
		console.log("state filtered", statefiltered)
		
		// var cause = []
		// var causeCount = []
		// var stateAbbr = []
		
		// statefilteredCause.forEach(function(data) {
			
		// 		cause.push(data.cause)
		// 		causeCount.push(data.total_causes)
		// 		stateAbbr.push(data.state)
		// 	});
		var cause =  statefilteredCause.map(function(d){
			return d.cause
		});

		var causeCount =  statefilteredCause.map(function(d){
			return d.total_causes
		});


			console.log("cause", cause)
			console.log("cause count", causeCount)
			// console.log("state", stateAbbr)
			
		d3.select("#canvasBarChart2")
			.append("canvas")
			.attr("id", "myBarChart2")	
			
		var ctxBar2 = document.getElementById('myBarChart2').getContext('2d');
		
		
		var myBarChart2 = new Chart(ctxBar2, {
			// The type of chart we want to create
			type: 'bar',
		
			// The data for our dataset
			data: {
				labels: cause,
				datasets: [{
					label: `Number of Fires By Cause - ${sel_val}`,
					backgroundColor: 'rgb(255, 99, 132)',
					borderColor: 'rgb(255, 99, 132)',
					// data: [0, 10, 5, 2, 20, 30, 45]
					data: causeCount
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
	

		console.log(fireData);


		var states =  fireData[2].map(function(d){
			return d.state
		});

		var total_fires =  fireData[2].map(function(d){
			return d.total_fires
		});
		console.log(states)
		console.log(total_fires)

		var latlongVals = latlong(sel_val)

		console.log(latlongVals)
		console.log("lat", latlongVals.lat)
		console.log("long", latlongVals.long)
		
		var data = [{
				type: "choroplethmapbox", locations: states, z: total_fires,
				colorscale: "Hot", 
				reversescale: true,
				marker: {opacity: .75},
				geojson: "https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json"
			}];
			
			var layout = {mapbox: {center: {lon: latlongVals.long , lat: latlongVals.lat, }, 
							style: 'light',
							zoom: 5},
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



			var statefilteredTop = fireData[3].filter(function(data) {
				return String(data.state) === sel_val;
			});

			console.log("statefiltered top", statefilteredTop)

			var top10Fires = statefilteredTop.filter(function(d, i){
				return i<10
			  })
		  
			  console.log("top 10 fires", top10Fires)
		  
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
		  
		  
			  var layout = {
				  title: `State: ${sel_val}`,
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
			  
			  Plotly.newPlot("myBar", plotData, layout)
	


}).catch(function(error) {
	console.log(error);
});

}

function onlyUnique(value,index, self) {
	return self.indexOf(value) === index;	
}

function latlong(sel_val){
	if (sel_val === "AK"){
		var lat = 63.588753
		var long = -154.493062
	}
	else if (sel_val === "AL"){
		var lat = 32.318231
		var long = -86.902298
	}
	else if (sel_val === "AR"){
		var lat = 35.20105
		var long = -91.831833
	}
	else if (sel_val === "AZ"){
		var lat = 34.048928
		var long = -111.093731
	}
	else if (sel_val === "CA"){
		var lat = 36.778261
		var long = -119.417932
	}
	else if (sel_val === "CO"){
		var lat = 39.550051
		var long = -105.782067
	}
	else if (sel_val === "FL"){
		var lat = 27.664827
		var long = -81.515754
	}
	else {
		var lat = 44.53155795563836
		var long = -102.61109623371827
	}
	return {lat, long}

	}

