document.addEventListener('DOMContentLoaded', (event) => {
    var ctx = document.getElementById('myChart').getContext('2d');

    // Get the data from the script tag
    var pieChartDataElement = document.getElementById('pieChartData');
    var pieChartData = JSON.parse(pieChartDataElement.textContent);
    
    // Extract the labels and values from the data
    var labels = pieChartData.map(function(e) {
        return e.name;
    });
    var data = pieChartData.map(function(e) {
        return e.value;
    });

    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(143, 170, 220, 1)',
                    'rgba(244, 177, 131, 1)',
                    'rgba(169, 209, 142, 1)',
                    'rgba(255, 217, 102, 1)',
                    'rgba(250, 166, 178, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                datalabels: {
                    formatter: (value, ctx) => {
                        let sum = 0;
                        let dataArr = ctx.chart.data.datasets[0].data;
                        dataArr.map(data => {
                            sum += data;
                        });
                        let percentage = (value*100 / sum).toFixed(2)+"%";
                        return percentage;
                    },
                    color: '#fff',
                }
            }
        }
    });    
});
