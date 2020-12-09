d3.json('/top_per_state').then(data => {
    // console.log(data);
});


// d3.json('/top_per_state').then(makeChart);

// function makeChart(data) {

//     // these are key:value pair 
//     var state = Object.entries(data).map(function (k, v) {
//         return { k: v.map(element => element[0]) }
//     })

//     console.log(state)

// }

// var labels = data.customers[0].amounts.map(function (e) {
//     return e[0];
// });

// var data = data.customers[0].amounts.map(function (e) {
//     return e[1];
// });



d3.json("/top_per_state").then(makeChart);

function makeChart(data) {
    var labels = data.cause[0].map(function (e) {
        return e[0];
    });
    var yValue = data.cause[0].amounts.map(function (e) {
        return e[1];
    });

    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                backgroundColor: 'rgb(129, 198, 2228)',
                borderColor: 'rgb(0, 150, 215)',
                data: yValue
            }]
        },
        options: {
            responsive: 'true',
        }
    });
};














// Bar chart
new Chart(document.getElementById("myCanvas"), {
    type: 'bar',
    data: {
        labels: country,
        datasets: [
            {
                label: "Cause Code by State",
                backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                data: value
            }
        ]
    },
    options: {
        legend: { display: false },
        title: {
            display: true,
            text: 'Fires by Cause Code'
        }
    }
});