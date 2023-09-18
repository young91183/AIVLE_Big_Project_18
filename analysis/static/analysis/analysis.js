$.ajaxSetup({
    headers: { "X-CSRFToken": '{{csrf_token}}' }
});

$(function() {
	$("#modal").modal("show");
});
// $(document).ready(function() {
//     $("#test").click(function() {
//         $.ajax({
//             url: "/analysis/test/", // 요청할 URL
//             type: "POST", // HTTP 메소드
//             data: { // 서버로 보낼 데이터
//                 message: "test"
//             },
//             success: function(response) {
//                 test_p.append("<p class='assistant-message'>채팅방 이름: "+ response.message + "</p>");
//             },
//             error: function(xhr, errmsg, err) { // 요청 실패시 실행할 함수
//                 console.log(errmsg); // 에러 메시지를 콘솔에 출력
//                 chatContainer.append(errmsg); // 에러 메시지를 컨테이너에 출력
//             }
//         });
//     });

// });

// 로딩창 로드
// $(window).load(function () {          //페이지가 로드 되면 로딩 화면을 없애주는 것
  // $('#loading').show();
    // 페이지 이동 후 3초(3000 밀리초) 동안 로딩 창을 보여준 뒤 숨깁니다.
  //   setTimeout(function() {
  //     $('#loading').hide();
  // }, 5000);
// });

// 차트그리기
// 라인차트
$(document).ready(function() {
  var context = document.getElementById('line_chart').getContext('2d');
  // Parse the JSON data
  var lineChartDataElement = JSON.parse(document.getElementById('lineData').textContent);
  var growdayLabels = lineChartDataElement.map(item => item.name);
  var growdayData = lineChartDataElement.map(item => item.value);

  var myChart = new Chart(context, {
    type: 'bar',
    data: {
      labels: growdayLabels,  // Use the extracted labels
      datasets: [{
        fill: false,
        data: growdayData,  // Use the extracted values
        backgroundColor: [
          'rgba(145, 211, 139, 1)',
          'rgba(255, 227, 155, 1)',
          'rgba(180, 232, 255, 1)',
          'rgba(220, 170, 237, 1)',
          'rgba(217, 217, 217, 1)',
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,  // 차트가 컨테이너 크기에 응답하도록 설정
      maintainAspectRatio: false,
      indexAxis: 'x',  // Change this to 'x'
      scales: {
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
      plugins: {
        legend: {
            display: false
        },
        title: {
            display: false,
            text: 'GROW 코칭 결과'
        }
      }
    }
  });
});


  // 파이차트
  $(document).ready(function() {
    var ctx = document.getElementById('pie_chart').getContext('2d');

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

  $(document).ready(function() {
    // 버튼 클릭 이벤트 처리
    $("#perspective_btn").click(function() {
      updateButtonColor($(this));
      updateTextInfo("관점변화","관점 변화는 대화상대가 기존과 다른 관점에서 해결책을 찾도록 하는 것으로 정의됩니다. 이 요인은 대화 상대가 생각할 수 있는 질문, 대화상대가 해결책을 찾을 수 있도록 하는 질문, 대화상대의 생각이나 관점을 되돌아보게 하는 질문이 해당됩니다.");
      resetOtherButtons($(this));
    });
  
    $("#recognition_btn").click(function() {
      updateButtonColor($(this));
      updateTextInfo("인정", "인정은 대화 상대가 스스로 문제를 해결할 능력을 가지고 있다 믿어주는 것으로 정의됩니다. 이 요인은 조금만 도와주면 대화 상대가 스스로 문제를 해결할 것이라고 믿음, 대화상대에게 적절한 도움을 제공하면 스스로 성장하고 발전할 것이라 믿음, 대화상대 자발적으로 동기부여 되는 사람이라고 믿음, 대화상대의 잠재능력과 성장 가능성을 믿는 것이 해당됩니다.");
      resetOtherButtons($(this));
    });
  
    $("#respect_btn").click(function() {
      updateButtonColor($(this));
      updateTextInfo("존중", "존중은 대화상대를 존중하고 심리적으로 지지하고 돕는 것으로 정의됩니다. 이 요인에는 인간으로서의 존중, 업무 방식 존중, 대화상대의 말에 주의를 기울임, 대화상대의 특성을 파악하고 적절한 대응 제공, 실수를 같이 수습하고 격려함, 대화상대의 입장을 고려함, 대화상대가 언제든지 도움을 청할 수 있음, 심리적으로 든든한 지원자가 되어줌이 해당됩니다.");
      resetOtherButtons($(this));
    });
  
    $("#judgment_btn").click(function() {
      updateButtonColor($(this));
      updateTextInfo("판단", "판단은 대화상대에게 선택지를 제공하거나 개인적인 의견이 포함되는 것으로 정의됩니다. 이 요인은 대화상대에게 개인적인 생각 및 의견이 포함된 질문, 대화상대에게 선택지를 제공하는 것이 해당됩니다.");
      resetOtherButtons($(this));
    });
  
    $("#mood_btn").click(function() {
      updateButtonColor($(this));
      updateTextInfo("부정", "부정은 대화 상대에게 부정적인 분위기를 주는 것으로 정의됩니다. 이 요인은 해당 질문이 대화상대에게 부정적인 분위기를 생성하는 것에 해당합니다.");
      resetOtherButtons($(this));
    });
  
    // 버튼 색상 변경 함수
    function updateButtonColor(button) {
      if (button.css("background-color") === "#B0DEE1") {
        button.css("background-color", "#D9D9D9");
      } else {
        button.css("background-color", "#B0DEE1");
      }
    }
  
    // 텍스트 정보 변경 함수
    // function updateTextInfo(text, content) {
    //   $("#info").html(text + ": " + content);
    // }
    function updateTextInfo(text, content) {
        $("#info").html(text + '<br><br>' +content);
      }

    // 다른 버튼들 원래 색상으로 되돌리는 함수
    function resetOtherButtons(currentButton) {
      $(".analysis_content_result_graph_box_btn_idx").not(currentButton).css("background-color", "#D9D9D9");
    }
  });