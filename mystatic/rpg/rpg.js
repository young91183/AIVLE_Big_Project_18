$(document).ready(function() {
    // 채팅 컨테이너를 참조하려고 변수 설정
    var chatContainer = $("#chat-container");

    // "send-btn" ID를 가진 버튼을 클릭하면 sendMessage 함수를 호출하도록 이벤트 설정
    $("#send-btn").click(function() {
        sendMessage();
    });

    // "user-input" ID를 가진 입력 필드에서 엔터 키를 누르면 sendMessage 함수를 호출하도록 이벤트 설정
    $("#user-input").keypress(function(event) {
        if (event.which === 13) {
            sendMessage();
        }
    });

    $("#end_btn").click(function() {
        window.location.href = "http://127.0.0.1:8000/analysis/";
    });

    // 사용자의 메시지를 전송하는 함수 정의
    function sendMessage() {
        var userInput = $("#user-input").val(); // 사용자 입력을 가져오기
        if (userInput !== "") { // 입력이 비어있지 않으면
            // 사용자 메시지를 채팅 컨테이너에 추가
            chatContainer.append("<p class='user-message'>당신: " + userInput + "</p>");
            scrollToBottom(); // 채팅 컨테이너를 맨 아래로 스크롤

            // 사용자 메시지를 서버로 POST 요청으로 보내기
            $.ajax({
                url: "/rpg/rpg_start/", // 요청할 URL
                type: "POST", // HTTP 메소드
                data: { // 서버로 보낼 데이터
                    message: userInput
                },
                success: function(response) {
                    chatContainer.append("<p class='assistant-message'>팀원: " + response.message + "</p>");
                    // 오디오 요소를 생성하고 소스를 반환된 오디오 URL로 설정
                    var audioElement = document.createElement("audio");
                    audioElement.src = "data:audio/wav;base64," + response.voice;
                    audioElement.controls = true;
                    audioElement.id = "myAudio";
                    chatContainer.append(audioElement);
                    audioElement.play(); // 음원 재생
                    scrollToBottom();
                },
            error: function(xhr, errmsg, err) { // 요청 실패시 실행할 함수
                console.log(errmsg); // 에러 메시지를 콘솔에 출력
                chatContainer.append(errmsg); // 에러 메시지를 컨테이너에 출력
            }
            });
            // 사용자 입력 필드 비우기
            $("#user-input").val("");
        }
    }

    // 채팅 컨테이너를 맨 아래로 스크롤하는 함수 정의
    function scrollToBottom() {
        chatContainer.scrollTop(chatContainer[0].scrollHeight);
    }


    // ------------------------------------------- stt----------------------------------------//
    const record = document.getElementById('record');
    const stop = document.getElementById('stop');
    const soundClips = document.getElementById('sound-clips');
    
    if(navigator.mediaDevices){
        var constraints = {
                audio:true
        }
    
        let chunks = []; // 녹음 데이터 저장하기 위한 변수
    
        navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);
    
            // 녹음 버튼 클릭했을 때
            record.onclick = () => {
                mediaRecorder.start(); //녹음 시작
                record.style.background = "red";
                record.style.color = "black";
            };
    
            // 정지 버튼 눌렀을 때
            stop.onclick = () => {
                mediaRecorder.stop(); // 녹음 정지
                record.style.background = "";
                record.style.color = "";
            };
    
            mediaRecorder.onstop = e => {
                // (1) <audio> 태그 담을 컨테이너 객체 생성
                const clipcontainer = document.createElement('article');                    
    
                // (2) audio 객체 생성 및 속성 설정
                const audio = document.createElement('audio');    
                audio.setAttribute('controls', '');
    
                // (3) 컨테이너에 audio 연결
                clipcontainer.appendChild(audio);
    
                // <div>에  <audio> 태그 출력
                // 이전에 녹음할 때 추가한 childNode가 존재한다면 제거하고
                if (soundClips.hasChildNodes())
                    soundClips.removeChild(soundClips.childNodes[0]);
                //추가
                soundClips.appendChild(clipcontainer);
    
                // chunks에 저장된 녹음 데이터를  audio 양식으로 설정
                const blob = new Blob(chunks, {
                    'type': 'audio/wav; codecs=MS_PCM' 
                });
    
                // chunks 초기화 (초기화 하지 않으면 녹음 내용이 누적 저장됨)
                chunks = [];
    
                // audio 소스 지정
                const audioURL = URL.createObjectURL(blob);
                audio.src = audioURL;
                
                // 녹음 데이터를 서버에 전송
                let formData = new FormData();
                formData.append('audio_data', blob);
    
                $.ajax({
                  url: "/rpg/stt/", // 요청할 URL
                  type: "POST", // HTTP 메소드
                  data: formData, // FormData 객체를 서버로 보내기
                  processData: false, // 필수
                  contentType: false, // 필수
                  success: function(response) {
                    $("#user-input").val(response.text);
                  },
                  error: function(xhr, errmsg, err) { // 요청 실패시 실행할 함수
                    console.log(errmsg); // 에러 메시지를 콘솔에 출력
                    soundClips.append(errmsg);// 에러 메시지를 컨테이너에 출력
                  }
                });
            };
    
            // 녹음 시작 상태가 되면 chunks에   녹음 데이터 저장
            mediaRecorder.ondataavailable = e => {
                chunks.push(e.data);
            };
        })
        .catch(err => {
            console.log("오류 발생 : " + err)
        })
    }
});




