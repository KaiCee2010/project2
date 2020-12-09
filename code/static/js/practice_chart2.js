d3.json('/cause').then(data => {
    console.log(data);
});


function optionChanged(STATE) {
    buildPlot(STATE);
    buildTable(STATE);
    buildGauge(STATE);
};

function init() {
    var selector = d3.select('');
    d3.json('/cause').then(function (data) {
        var chosen = data.state
        chosen.forEach(state => {
            selector.append('option')
                .text(state)
                .property('value', state)
        });
    });

    buildPlot("TX");
    buildTable("TX");
    buildGauge("TX");
};

init();

function buildPlot(STATE) {

    d3.json("/cause").then(function (data) {
        console.log("buildPlot", data);

        var labels = data.cause(cause => state === STATE)[0];
        console.log("buildPlot", labels);

        var labelValues = data.total_causes(cause => state === STATE)[0];
        console.log("buildPlot", labelValues)

        // Bar chart
        new Chart(document.getElementById("myChart"), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Cause Code by State",
                        backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                        data: labelValues
                    }
                ]
            },
            options: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Fires, by Cause-Code'
                }
            }
        });
    });
};




function buildTable(STATE) {

    d3.json("/cause").then(function (data) {


        var state_info = data.cause.filter(cause => causes.id.toString() === STATE)[0];
        console.log(state_info);


        var stateInfoTable = d3.select("...where ever this table will go in HTML")

        // empty and then regenerate the Demographics Table by appending 
        stateInfoTable.html("");

        Object.entries(state_info).forEach((key) => {
            stateInfoTable.append("h5").text(key[0] + ": " + key[1]);

        });
    });
};
