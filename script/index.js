$(function() {
  filterBtn();
});


function filterBtn() {
  $(".header").on("click mouseenter", ".js-filter-btn", function() {
    $(".js-filter-screen").toggleClass("is-show");
  });
}