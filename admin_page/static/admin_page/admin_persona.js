document.addEventListener('DOMContentLoaded', (event) => {
    // 성별 데이터
    const genderCounts = JSON.parse(document.getElementById('gender_counts').textContent);
    const genderLabels = genderCounts.map(item => item.gender);
    const genderData = genderCounts.map(item => item.gender_count);

    const ctxGender = document.getElementById('gender_Chart').getContext('2d');
    new Chart(ctxGender, {
        type: 'bar',
        data: {
            labels: genderLabels,
            datasets: [{
                data: genderData,
                backgroundColor: genderLabels.map(x => x === '남성' ? 'rgba(0, 128, 128, 0.6)' : 'rgba(231, 84, 128, 0.6)'),
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
                    text: '성별 비율'
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
                    beginAtZero: true
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

    // 연령대 데이터
    const ageCounts = JSON.parse(document.getElementById('age_counts').textContent);
    const ageLabels = ageCounts.map(item => item.age_group);
    const ageData = ageCounts.map(item => item.age_group_count);

    const ctxAge = document.getElementById('age_Chart').getContext('2d');
    new Chart(ctxAge, {
        type: 'bar',
        data: {
            labels: ageLabels,
            datasets: [{
                data: ageData,
                backgroundColor: 'rgba(220, 170, 220, 1)',
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false,
                    text: '선택한 연령대',
                },
                datalabels: {
                    display: true,
                    color: '#000',
                    font: {
                        size: 16,
                        weight: 'bold',
                    },
                    formatter: (value, context) => {
                        return context.chart.data.labels[context.dataIndex] + ': ' + value;
                    },
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
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
                    maxTicksLimit: 20 // 최대 눈금 개수 제한 (원하는 값으로 조정)
                },
            },
            animation: {
                animateScale: true,
                animateRotate: true,
            },
        },
    });

   // Rank 데이터
   const rankCounts = JSON.parse(document.getElementById('rank_counts').textContent);
   const rankLabels = rankCounts.map(item => item.rank);
   const rankData = rankCounts.map(item => item.rank_count);
   const rankColors = [
       'rgba(143, 170, 220, 1)',
       'rgba(244, 177, 131, 1)',
       'rgba(169, 209, 142, 1)',
       'rgba(255, 217, 102, 1)',
       'rgba(250, 166, 178, 1)',
       'rgba(167, 226, 225, 1)',
       'rgba(193, 167, 226, 1)',
   ];

   const ctxRank = document.getElementById('rank_Chart').getContext('2d');
   new Chart(ctxRank, {
       type: 'pie',
       data: {
           labels: rankLabels,
           datasets: [{
               data: rankData,
               backgroundColor: rankColors,
           }]
       },
       options: {
           responsive: false,
           plugins: {
               title: {
                   display: false,
                   text: '선택한 직급'
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
           }
       }
   });

   // Department 데이터
   const departmentCounts = JSON.parse(document.getElementById('department_counts').textContent);
   const departmentLabels = departmentCounts.map(item => item.department);
   const departmentData = departmentCounts.map(item => item.department_count);
   const departmentColors = [
        'rgba(143, 170, 220, 1)',
        'rgba(244, 177, 131, 1)',
        'rgba(169, 209, 142, 1)',
        'rgba(255, 217, 102, 1)',
        'rgba(250, 166, 178, 1)',
        'rgba(167, 226, 225, 1)',
        'rgba(193, 167, 226, 1)',
   ]

   const ctxDepartment = document.getElementById('department_Chart').getContext('2d');
   new Chart(ctxDepartment, {
       type: 'pie',
       data: {
           labels: departmentLabels,
           datasets: [{
               data: departmentData,
               backgroundColor: departmentColors,
           }]
       },
       options: {
           responsive: false,
           plugins: {
               title: {
                   display: false,
                   text: '선택한 직무'
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
           }
       }
   });
});