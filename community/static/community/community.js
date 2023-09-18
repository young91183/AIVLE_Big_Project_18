// // 사이드바
// /* EXPANDER MENU */
// const showMenu = (toggleId, navbarId, bodyId) => {
//     const toggle = document.getElementById(toggleId),
//     navbar = document.getElementById(navbarId),
//     bodypadding = document.getElementById(bodyId)

//     if( toggle && navbar ) {
//         toggle.addEventListener('click', ()=>{
//             navbar.classList.toggle('expander');

//             bodypadding.classList.toggle('body-pd')
//         });
//     }
// }

// showMenu('nav-toggle', 'navbar', 'body-pd');

// /* LINK ACTIVE */
// const linkColor = document.querySelectorAll('.nav__link')
// function colorLink() {
//     linkColor.forEach(l=> l.classList.remove('active'))
//     this.classList.add('active')
// }
// linkColor.forEach(l=> l.addEventListener('click', colorLink))

// /* COLLAPSE MENU */
// const linkCollapse = document.getElementsByClassName('collapse__link')
// var i

// for(i=0;i<linkCollapse.length;i++) {
//     linkCollapse[i].addEventListener('click', function(){
//         const collapseMenu = this.nextElementSibling
//         collapseMenu.classList.toggle('showCollapse')

//         const rotate = collapseMenu.previousElementSibling
//         rotate.classList.toggle('rotate')
//     });
// }


// // 사이드바 토글 함수
// function toggleSidebar() {
//   const navbar = document.getElementById('navbar');
//   const bodypadding = document.getElementById('body-pd');
//   const row = document.querySelector('.row');

//   navbar.classList.toggle('expander');
//   bodypadding.classList.toggle('body-pd');
//   row.classList.toggle('expander');
// }

// // 사이드바 토글 아이콘 클릭 이벤트 리스너 등록
// const navToggle = document.getElementById('nav-toggle');
// navToggle.addEventListener('click', toggleSidebar);


// ============================= 원래 사이드바 =============================
function toggleSidebar() {
  const navbar = document.getElementById('navbar');
  const bodypadding = document.getElementById('body-pd');
  const row = document.querySelector('.row');

  navbar.classList.toggle('expander');
  bodypadding.classList.toggle('body-pd');
  row.classList.toggle('expander');

  const contentContainer = document.getElementById('content-container');
  const contentWidth = document.querySelector('.col-md-9').offsetWidth;

  if (row.classList.contains('expander')) {
    contentContainer.style.setProperty('--content-width', contentWidth + 'px');
  } else {
    contentContainer.style.setProperty('--content-width', 'calc(100vw - var(--nav--width))');
  }
}

const navToggle = document.getElementById('nav-toggle');
navToggle.addEventListener('click', toggleSidebar);
