$(function() {
	$("#modal").modal("show");
});

$(document).ready(function() {
    // 초기에는 result2만 보이도록 설정
    $("#result2").show();
    $("#result3").hide();

    // 설문 결과 확인 버튼 클릭 이벤트 처리
    $("#survey_result_confirm").click(function() {
        $("#result2").toggle();
        $("#result3").toggle();
    });
});