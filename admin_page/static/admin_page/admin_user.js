document.addEventListener('DOMContentLoaded', (event) => {

        // 요일 별 차트
    const weekdayCounts = JSON.parse(document.getElementById('weekday_chart_data').textContent);
    const weekdayLabels = weekdayCounts.map(item => item.weekday);
    const weekdayData = weekdayCounts.map(item => item.value);
    const ctx_weekday = document.getElementById('weekday_Chart').getContext('2d');
    new Chart(ctx_weekday, {
        type: 'bar',
        data: {
            labels: weekdayLabels,
            datasets: [{
                data: weekdayData,
                backgroundColor: 'rgba(143, 170, 220, 1)',
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false,
                    text: '시간 별'
                },
                datalabels: {
                    display: true,
                    color: '#000',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    formatter: (value, context) => {
                        return context.chart.data.labels[context.dataIndex] + ': ' + value;
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    maxTicksLimit: 24 ,// x 축 눈금 개수 제한
                    callback: function(value, index, values) {
                        return value.toString(); // 눈금에 숫자로 표시
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0, // 소수점 이하 자릿수를 0으로 설정하여 정수로 표시
                        callback: function(value, index, values) {
                            if (Math.floor(value) === value) {
                                return value;
                            }
                        }
                    },
                    autoSkip: true, // 데이터에 맞게 눈금 간격 자동 조정
                    maxTicksLimit: 10 // 최대 눈금 개수 제한 (원하는 값으로 조정)
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });

    
    // 시간대 차트
    const hourCounts = JSON.parse(document.getElementById('hour_chart_data').textContent);
    const hourLabels = hourCounts.map(item => item.time);
    const hourData = hourCounts.map(item => item.vlaue_hour);
    const ctx_hour = document.getElementById('hour_Chart').getContext('2d');
    new Chart(ctx_hour, {
        type: 'bar',
        data: {
            labels: hourLabels,
            datasets: [{
                data: hourData,
                backgroundColor: 'rgba(143, 170, 220, 1)',
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false,
                    text: '시간 별'
                },
                datalabels: {
                    display: true,
                    color: '#000',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    formatter: (value, context) => {
                        return context.chart.data.labels[context.dataIndex] + ': ' + value;
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    maxTicksLimit: 24 ,// x 축 눈금 개수 제한
                    callback: function(value, index, values) {
                        return value.toString(); // 눈금에 숫자로 표시
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0, // 소수점 이하 자릿수를 0으로 설정하여 정수로 표시
                        callback: function(value, index, values) {
                            if (Math.floor(value) === value) {
                                return value;
                            }
                        }
                    },
                    autoSkip: true, // 데이터에 맞게 눈금 간격 자동 조정
                    maxTicksLimit: 10 // 최대 눈금 개수 제한 (원하는 값으로 조정)
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
});
