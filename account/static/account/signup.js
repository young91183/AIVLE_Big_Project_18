// 개인정보 동의 체크 여부 확인
// $(document).ready(function() {
//     // START 버튼 클릭 이벤트
//     $("#startBtn").on("click", function() {
//       const userIsAuthenticated = $( "#user-data" ).attr( "data-user-is-authenticated" );
  
//       if (loggedIn(userIsAuthenticated)) {
//         // 로그인된 상태이면 'rpg:persona' 페이지로 이동
//         // 안 되길래 /rpg/persona -> /rpg로 변경
//         window.location.href = `${window.origin}/rpg/`;
//       } else {
//         // 로그인되지 않은 상태이면 경고 팝업 표시
//         alert("로그인이 필요합니다.");
//       }
//     });
  
//   });

// 개인 정보 처리 방안 팝업
$(function() {
	$("#modal").modal("show");
});

// 모달 띄우기 코드
// $(document).ready(function() {
//     $("#add_feed").on("click", function() {
//       const modal = $("#modal_add_feed");
//       modal.css("display", "flex");
//     //   $(".modal_overlay").show();
//     //   $("body").css("overflow-y", "hidden"); // 스크롤 없애기
    
//         console.log(window.pageYOffset + " 위치"); // 로그 찍기
//     });

// 모달 닫기 코드
//     $("#close_modal").on("click", function() {
//         const modal = $("#modal_add_feed");
//         modal.css("display", "none");
//         $("body").css("overflow-y", "visible");
//     });
//   });

$(document).ready(function() {
  // 중복 체크 여부 변수 초기화
  var isDuplicateChecked = false;
  // 개인정보 처리 체크 여부 변수 초기화
  var isPersonalInfoChecked = false;
  // 이메일 중복 처리 체크 여부 변수 초기화
  var isEmailDuplicateChecked = false;
  // 닉네임 중복 처리 체크 여부 변수 초기화
  var isNicknameDuplicateChecked = false;

  // CSRF 토큰 추출
  var csrftoken = getCookie('csrftoken');

  $('#id_duplicate_btn').click(function() {
    var userid = $('#userid').val();
  
    if (!userid) {
      alert('아이디를 입력해주세요.');
      return;
    }
  
    // 중복확인 버튼 클릭 후 아이디 입력 필드 비활성화
    $('#userid').prop('disabled', true);
    $('#hidden_userid').val(userid);

    $.ajax({
      url: '/account/check_duplicate/',
      type: 'POST',
      data: {userid: userid},
      dataType: 'json',
      beforeSend: function(xhr, settings) {
        // CSRF 토큰을 요청 헤더에 포함시킴
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      },
      success: function(response) {
        if (response.is_taken) {
          $('#duplicate-message').text('* 이미 사용 중인 ID입니다.');
          isDuplicateChecked = false; // 중복된 ID일 경우 체크 여부를 false로 설정
          // 중복확인 완료 후 아이디 입력 필드 잠금 해제
          $('#userid').prop('disabled', false);
        } else {
          $('#duplicate-message').text('* 사용 가능한 ID입니다.');
          isDuplicateChecked = true; // 사용 가능한 ID일 경우 체크 여부를 true로 설정
          // 중복확인 완료 후 아이디 입력 필드 잠금
          $('#userid').prop('disabled', true);
        }
      },
      error: function(xhr, errmsg, err) {
        console.log(errmsg);
        // 중복확인 완료 후 아이디 입력 필드 잠금 해제
        $('#userid').prop('disabled', false);
      }
    });
  });
  
  // 입력 필드 변경 이벤트 처리
  // 아이디 입력 필드 변경 이벤트 처리
  $('#userid').on('input', function() {
    var input = $(this).val();
    var sanitizedInput = input.replace(/[^A-Za-z0-9]/g, '');
    var errorMessage = '';
  
    if (input !== sanitizedInput) {
      errorMessage = '영어와 숫자를 제외한 문자는 사용하실 수 없습니다.';
    }
  
    // 최소 길이 제약 추가
    var minLength = 5;
    if (input.length < minLength) {
      errorMessage = '아이디는 최소 ' + minLength + '글자 이상이어야 합니다.';
    }

    // 최대 길이 제약 추가
    var maxLength = 32; // 아이디 최대 길이
    if (input.length > maxLength) {
      errorMessage = '아이디는 최대 ' + maxLength + '글자까지 입력할 수 있습니다.';
    }
  
    $('#userid-error').text(errorMessage);
  
    // 중복확인 버튼 활성화/비활성화 처리
    var isButtonDisabled = errorMessage !== '' || input.length < minLength;
    $('#id_duplicate_btn').prop('disabled', isButtonDisabled);
  });

  // 비밀번호1
    $('#password1').on('input', function() {
      var input = $(this).val();
      var hasMinLength = input.length >= 8;
      var hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(input);
      var hasLetter = /[a-zA-Z]/.test(input);
      var hasNumber = /[0-9]/.test(input);
      var errorMessage = '';

      if (!hasMinLength) {
          errorMessage = '비밀번호는 최소 8글자 이상이어야 합니다.';
      } else if (!(hasSpecialChar && hasLetter && hasNumber)) {
          errorMessage = '비밀번호는 특수문자, 영어, 숫자를 혼용하여야 합니다.';
      } else {
          errorMessage = '사용할 수 있습니다.';
      }

      $('#password1-error').text(errorMessage);
      updatePassword2ErrorMessage();
  });

  // 비밀번호2
  $('#password2').on('input', function() {
      updatePassword2ErrorMessage();
  });

  function updatePassword2ErrorMessage() {
      var password1Value = $('#password1').val();
      var password2Value = $('#password2').val();
      var errorMessage = '';

      if (password1Value !== password2Value) {
          errorMessage = '비밀번호가 일치하지 않습니다.';
      } else if (password1Value !== '' && $('#password1-error').text() === '사용할 수 있습니다.') {
          errorMessage = '비밀번호가 같습니다.';
      }

      $('#password2-error').text(errorMessage);
  }

  // 이메일
  $('#email').on('input', function() {
    var input = $(this).val();
    var atIndex = input.indexOf('@');
    var dotIndex = input.lastIndexOf('.');
    var errorMessage = '';

    if (atIndex < 1 || dotIndex < (atIndex + 2) || dotIndex >= input.length - 1) {
      errorMessage = '유효한 이메일 주소를 입력해주세요.';
    } else {
        var leftPart = input.substring(0, atIndex);
        var middlePart = input.substring(atIndex + 1, dotIndex);
        var rightPart = input.substring(dotIndex + 1);

        var leftPartRegex = /^[A-Za-z0-9]+$/;
        var middlePartRegex = /^[A-Za-z]+$/;
        var rightPartRegex = /^[A-Za-z]+$/;

        if (!leftPartRegex.test(leftPart) || !middlePartRegex.test(middlePart) || !rightPartRegex.test(rightPart) || dotIndex === (atIndex + 1)) {
            errorMessage = '유효한 이메일 주소를 입력해주세요.';
        }
    }

    // 최대 길이 제약 추가
    var maxLength = 100; // 이메일 최대 길이
    if (input.length > maxLength) {
      errorMessage = '이메일은 최대 ' + maxLength + '글자까지 입력할 수 있습니다.';
    }

    $('#email-error').text(errorMessage);
  });

  // 이메일 중복확인 버튼 클릭 이벤트 처리
  $('#email_duplicate_btn').click(function() {
    var email = $('#email').val();
  
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }
  
    // 중복확인 버튼 클릭 후 이메일 입력 필드 비활성화
    $('#email').prop('disabled', true);
    $('#hidden_email').val(email);

    $.ajax({
      url: '/account/check_duplicate_email/',
      type: 'POST',
      data: { email: email },
      dataType: 'json',
      beforeSend: function(xhr, settings) {
        // CSRF 토큰을 요청 헤더에 포함시킴
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      },
      success: function(response) {
        if (response.is_taken) {
          $('#email-duplicate-message').text('중복된 이메일입니다.');
          isEmailDuplicateChecked = false; // 중복된 이메일일 경우
          // 중복확인 완료 후 이메일 입력 필드 잠금 해제
          $('#email').prop('disabled', false);
        } else {
          $('#email-duplicate-message').text('사용 가능한 이메일입니다.');
          isEmailDuplicateChecked = true; // 사용 가능한 이메일일 경우
          // 중복확인 완료 후 이메일 입력 필드 잠금
          $('#email').prop('disabled', true);
        }
      },
      error: function(xhr, errmsg, err) {
        console.log(errmsg);
        // 중복확인 완료 후 이메일 입력 필드 잠금 해제
        $('#email').prop('disabled', false);
      }
    });
  });
  
  // 입력 필드 변경 이벤트 처리
  $('#username').on('input', function() {
    var input = $(this).val();
    var isEnglish = /^[a-zA-Z]+$/.test(input);
    var isKorean = /^[ㄱ-ㅎㅏ-ㅣ가-힣]+$/.test(input);
    var errorMessage = '';

    if ((isEnglish && isKorean) || (!isEnglish && !isKorean)) {
      errorMessage = '영어만 쓰거나 한국어만 사용 가능합니다.';
    }

    $('#username-error').text(errorMessage);
  });

  $('#nickname').on('input', function() {
    var input = $(this).val();
    var hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(input);
    var errorMessage = '';
  
    if (hasSpecialChar) {
      errorMessage = '특수문자는 사용할 수 없습니다.';
    }
  
    $('#nickname-error').text(errorMessage);
  });

  $('#nickname_duplicate_btn').click(function() {
    var nickname = $('#nickname').val();
  
    if (!nickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }
  
    // 중복확인 버튼 클릭 후 닉네임 입력 필드 비활성화
    $('#nickname').prop('disabled', true);
    $('#hidden_nickname').val(nickname);

    $.ajax({
      url: '/account/check_nickname/',
      type: 'POST',
      data: { nickname: nickname },
      dataType: 'json',
      beforeSend: function(xhr, settings) {
        // CSRF 토큰을 요청 헤더에 포함시킴
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      },
      success: function(response) {
        if (response.is_taken) {
          $('#nickname-duplicate-message').text('* 이미 사용 중인 닉네임입니다.');
          isNicknameDuplicateChecked = false; // 중복된 닉네임일 경우 체크 여부를 false로 설정
          // 중복확인 완료 후 닉네임 입력 필드 잠금 해제
          $('#nickname').prop('disabled', false);
        } else {
          $('#nickname-duplicate-message').text('* 사용 가능한 닉네임입니다.');
          isNicknameDuplicateChecked = true; // 사용 가능한 닉네임일 경우 체크 여부를 true로 설정
          // 중복확인 완료 후 닉네임 입력 필드 잠금
          $('#nickname').prop('disabled', true);
        }
      },
      error: function(xhr, errmsg, err) {
        console.log(errmsg);
        // 중복확인 완료 후 닉네임 입력 필드 잠금 해제
        $('#nickname').prop('disabled', false);
      }
    });
  });

  // 개인정보 처리 체크박스 클릭 이벤트 처리
  $('.signup_content_detail_person_info').click(function() {
    isPersonalInfoChecked = $(this).is(':checked'); // 개인정보 처리 체크 여부를 변수에 저장
  });

  // 폼 제출 이벤트를 처리
  $('form').submit(function(event) {
    var isNicknameValid = !hasSpecialChar && !isNicknameDuplicateChecked;
  
    if (!isDuplicateChecked) {
      event.preventDefault(); // 아이디 중복확인을 하지 않은 경우 폼 제출을 막음
      alert('아이디 중복확인을 해주세요.');
    } else if (!isPersonalInfoChecked) {
      event.preventDefault(); // 개인정보 처리에 동의하지 않은 경우 폼 제출을 막음
      alert('개인정보 수집 및 이용에 동의해주세요.');
    } else if (!isEmailDuplicateChecked) {
      event.preventDefault(); // 이메일 중복확인을 하지 않은 경우 폼 제출을 막음
      alert('이메일 중복확인을 해주세요.');
    } else if (!isNicknameValid) {
      event.preventDefault(); // 닉네임에 중복확인을 하지 않은 경우 폼 제출을 막음
      alert('닉네임 중복확인을 해주세요.');
    }
  });

  // Cookie에서 CSRF 토큰 추출
  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
});