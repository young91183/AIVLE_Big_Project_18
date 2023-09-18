$.ajaxSetup({
    headers: { "X-CSRFToken": '{{csrf_token}}' }
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

// 설문팝업
$(function() {
	$("#survey_modal").modal("show");
});

// 차트그리기
// 바차트
$(document).ready(function() {
    var context = $('#bar_chart')[0].getContext('2d');
    var myChart = new Chart(context, {
      type: 'horizontalBar',
      data: {
        labels: ['1', '2'],
        datasets: [{
          label: '점수',
          fill: false,
          data: [21, 19],
          backgroundColor: [
            '#E9FFFF',
            '#F0F0F0',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            '#2FC4CE',
            '#919191',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        // indexAxis: 'y',
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true
            }
          }],
        }
      }
    });
  });

//   라인차트
  $(document).ready(function() {
    var context = $('#line_chart')[0].getContext('2d');
    var myChart = new Chart(context, {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        datasets: [{
          label: 'test1',
          fill: false,
          data: [21, 19, 25, 20, 23, 26, 25],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  });

  $(document).ready(function() {
    var context = $('#radar_chart')[0].getContext('2d');
    var myChart = new Chart(context, {
      type: 'radar',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        datasets: [{
          label: 'test1',
          fill: false,
          data: [21, 19, 25, 20, 23, 26, 25],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  });