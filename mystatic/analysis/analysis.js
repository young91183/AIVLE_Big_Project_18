$(document).ready(function() {
    $("#test").click(function() {
        $.ajax({
            url: "/analysis/test/", // 요청할 URL
            type: "POST", // HTTP 메소드
            data: { // 서버로 보낼 데이터
                message: "test"
            },
            success: function(response) {
                test_p.append("<p class='assistant-message'>채팅방 이름: "+ response.message + "</p>");
            },
            error: function(xhr, errmsg, err) { // 요청 실패시 실행할 함수
                console.log(errmsg); // 에러 메시지를 콘솔에 출력
                chatContainer.append(errmsg); // 에러 메시지를 컨테이너에 출력
            }
        });
    });

});