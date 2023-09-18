// 사이드바
/* EXPANDER MENU */
const showMenu = (toggleId, navbarId, bodyId) => {
    const toggle = document.getElementById(toggleId),
    navbar = document.getElementById(navbarId),
    bodypadding = document.getElementById(bodyId)

    if( toggle && navbar ) {
        toggle.addEventListener('click', ()=>{
            navbar.classList.toggle('expander');

            bodypadding.classList.toggle('body-pd')
        })
    }
}

// grow 예시 질문 팝업창
  

showMenu('nav-toggle', 'navbar', 'body-pd')

/* LINK ACTIVE */
const linkColor = document.querySelectorAll('.nav__link')
function colorLink() {
    linkColor.forEach(l=> l.classList.remove('active'))
    this.classList.add('active')
}
linkColor.forEach(l=> l.addEventListener('click', colorLink))

/* COLLAPSE MENU */
const linkCollapse = document.getElementsByClassName('collapse__link')
var i

for(i=0;i<linkCollapse.length;i++) {
    linkCollapse[i].addEventListener('click', function(){
        const collapseMenu = this.nextElementSibling
        collapseMenu.classList.toggle('showCollapse')

        const rotate = collapseMenu.previousElementSibling
        rotate.classList.toggle('rotate')
    });
}

// =====================================================================
// 시뮬레이션 메인
$(document).ready(function() {
    var chatContainer = $("#chat-container");

    $("#send-btn").click(function() {
        sendMessage();
    });

    $("#user-input").keypress(function(event) {
        if (event.which === 13) {
            sendMessage();
        }
    });

    function sendMessage() {
        var userInput = $("#user-input").val();
        if (userInput !== "") {
            chatContainer.append("<div class='user_message'>" 
            + userInput
            + "<img class='user_profile' src='/static/img/basic.png' alt='사용자이미지'>"
            + "</div>");
            scrollToBottom();
            message = '"'+userInput+'"' + '라는 문장이 GROW 코칭대화 모델에서 G,R,O,W중 무엇인지 알려줘. 간단하게 답변해줘'
            $.ajax({
                url: "/grow_practice/grow_start/",
                type: "POST",
                data: {
                    message: message
                },
                success: function(response) {
                    chatContainer.append("<div class='assistant_message'>"
                    + "<div class='assistant_message_left'>"
                    + "<img class='assistant_profile' src='/static/img/kt_robot.png' alt='페르소나이미지'>"
                    + response.message
                    + "</div>"
                    + "</div>");
            
                    scrollToBottom();
                },
                
                error: function(xhr, errmsg, err) {
                    console.log(errmsg);
                    chatContainer.append(errmsg);
                }
            });

            $("#user-input").val("");
        }
    }

    function scrollToBottom() {
        chatContainer.scrollTop(chatContainer[0].scrollHeight);
    }

    //--------------------------------stt--------------------------------------//
    const record = document.getElementById('record');
    let isRecording = false;
    let isPlaying = false;
    let audio = null;

    if (navigator.mediaDevices) {
        var constraints = {
            audio: true
        };

        let chunks = [];

        navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });  // mimeType을 audio/webm으로 설정

            record.onclick = () => {
                if (!isRecording) {
                    mediaRecorder.start();
                    isRecording = true;
                    // record.style.background = "#BDF2F6";
                    record.style.color = "#B21818";
                } else {
                    mediaRecorder.stop();
                    isRecording = false;
                    record.style.background = "";
                    record.style.color = "";
                }
            };

            mediaRecorder.onstop = e => {
                audio = document.createElement('audio');
                audio.setAttribute('controls', '');

                const blob = new Blob(chunks, { type: 'audio/webm' });  // blob type을 audio/webm으로 설정

                chunks = [];

                const audioURL = URL.createObjectURL(blob);
                audio.src = audioURL;
                
                let formData = new FormData();
                formData.append('audio_data', blob);

                $.ajax({
                    url: "/grow_practice/stt/",
                    type: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        $("#user-input").val(response.text);
                    },
                    error: function(xhr, errmsg, err) {
                        console.log(errmsg);
                    }
                });
            };

            mediaRecorder.ondataavailable = e => {
                chunks.push(e.data);
            };
        })
        .catch(err => {
            console.log("오류 발생 : " + err)
        });
    }
});

// 모달창 //
document.addEventListener("DOMContentLoaded", function() {
    // 토글 버튼 클릭 이벤트
    document.getElementById("grow-ex").addEventListener("click", function() {
      growshowModal();
    });

    document.getElementById("error_guide").addEventListener("click", function() {
        errorshowModal();
      });
  
    // 모달 표시 함수
    function growshowModal() {
      var modalContent = document.getElementById("modalContent");
      var modalImage = document.getElementById("modalImage");
      modalImage.src = "/static/img/grow_ex.png";
      modalImage.alt = "Grow Example";
  
      document.getElementById("modalWrap").style.display = "block";
    }

    function errorshowModal() {
        var modalContent = document.getElementById("modalContent");
        var modalImage = document.getElementById("modalImage");
        modalImage.src = "/static/img/error_guide.png";
        modalImage.alt = "Error Guide";
    
        document.getElementById("modalWrap").style.display = "block";
      }
  
    // 모달 숨기는 함수
    function hideModal() {
      document.getElementById("modalWrap").style.display = "none";
    }
  
    // 모달 닫기 버튼 클릭 이벤트
    document.getElementById("closeBtn").addEventListener("click", hideModal);
  
    // 모달 영역 외부 클릭 이벤트
    document.getElementById("modalWrap").addEventListener("click", function(e) {
      if (e.target.id === "modalWrap") {
        hideModal();
      }
    });
  });