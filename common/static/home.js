$(document).ready(function() {
    // 로그인 확인 함수
    function loggedIn(userIsAuthenticated) {
      return userIsAuthenticated.toLowerCase() === "true";
    }
  
    // START 버튼 클릭 이벤트
    $("#startBtn").on("click", function() {
      const userIsAuthenticated = $( "#user-data" ).attr( "data-user-is-authenticated" );
  
      if (loggedIn(userIsAuthenticated)) {
        // 로그인된 상태이면 'rpg:persona' 페이지로 이동
        // 안 되길래 /rpg/persona -> /rpg로 변경
        window.location.href = `${window.origin}/rpg/`;
      } else {
        // 로그인되지 않은 상태이면 경고 팝업 표시
        alert("로그인이 필요합니다.");
      }
    });
  
  });
  
  // 클릭시 부드럽게 이동
  $('a').click(function () {
    $('html, body').animate({
      scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
    return false;
  });


// 처음으로 버튼 클릭 이벤트 처리
document.addEventListener('DOMContentLoaded', function () {
  const goHomeButton = document.getElementById('goHomeButton');
  goHomeButton.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});



$(function() {
	$("#modal").modal("show");
});

  


/*-------------------------FOR BOSS-------------------------*/

// document.getElementById("hyunji-container").addEventListener("click", function () {
//   this.querySelector(".profile_box_boss").classList.toggle("flip");
// });

// document.getElementById("team-container").addEventListener("click", function () {
//   this.querySelector(".profile_box_team").classList.toggle("flip1");
// });




