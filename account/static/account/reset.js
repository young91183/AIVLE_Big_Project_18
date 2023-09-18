$(document).ready(function() {
    // 비밀번호 입력값 변경 시 이벤트 처리
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
        errorMessage = '비밀번호는 특수문자, 영어, 숫자를 혼용해야합니다.';
      } else {
        errorMessage = '사용할 수 있습니다.';
      }
  
      $('#password1-error').text(errorMessage);
      updatePassword2ErrorMessage();
      updateSubmitButtonState();
    });
  
    // 비밀번호 확인 입력값 변경 시 이벤트 처리
    $('#password2').on('input', function() {
      updatePassword2ErrorMessage();
      updateSubmitButtonState();
    });
  
    // 초기 실행 시 버튼 상태 업데이트
    updateSubmitButtonState();
  
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
  
    function updateSubmitButtonState() {
      var password1Value = $('#password1').val();
      var password2Value = $('#password2').val();
  
      if (password1Value === password2Value && password1Value !== '' && $('#password1-error').text() === '사용할 수 있습니다.') {
        $('button[type="submit"]').prop('disabled', false);
      } else {
        $('button[type="submit"]').prop('disabled', true);
      }
    }
  
    // 페이지 로딩 시 버튼 초기 상태 설정
    updateSubmitButtonState();
  });
  