$(document).ready(function() {
    $('html, body').animate({ scrollTop: 0 }, 0); // 페이지 로딩시 맨 위로 스크롤
  
    $(window).scroll(function() {
      clearTimeout($.data(this, 'scrollTimer'));
      $.data(this, 'scrollTimer', setTimeout(function() {
        var pageList = ['#page1', '#page2', '#page3', '#page4'];
        var previousPage = "";
  
        for (var i = 0; i < pageList.length; i++) {
          var currentPage = $(pageList[i]);
          var scrollTop = $(window).scrollTop();
          var pageTop = currentPage.offset().top;
  
          if (scrollTop < pageTop) {
            if (previousPage === "") {
              // 스크롤이 최상단 페이지보다 위에 있는 경우
              $('html, body').animate({ scrollTop: 0 }, 'slow');
            } else {
              // 이전 페이지로 스크롤 잡아주기
              $('html, body').animate({ scrollTop: $(previousPage).offset().top }, 'slow');
            }
            break;
          } else if (i === pageList.length - 1) {
            // 스크롤이 최하단 페이지보다 아래에 있는 경우
            $('html, body').animate({ scrollTop: $(pageList[i]).offset().top }, 'slow');
          } else {
            previousPage = pageList[i];
          }
        }
      }, 100));
    });
  });
  