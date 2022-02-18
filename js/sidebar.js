// const $ = document.querySelector.bind(document);
// const $$ = document.querySelectorAll.bind(document);
var sidebar = $('#sidebar');

var mobileMenu = $('.side__submenu-toggle');
console.log(mobileMenu)
var sidebarWidth = sidebar.clientWidth;
var appContainer = $('.app-container');
var appHeader = $('.header:first-child');
var show = false;
mobileMenu.onclick = function () {
    show = !show;
    // console.log(sidebar)
    sidebar.classList.toggle('active', show);
    appContainer.classList.toggle('no-active-menu',show);
    // appHeaderFirst.classList.toggle('no-active-menu',show);
    
    appHeader.classList.toggle('no-active-menu',show);
    
}