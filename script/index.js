$(function() {
  filterBtn();
});


function filterBtn() {
  let isWait = false;

  $(".header").on("click mouseenter", ".js-filter-btn", function(e) {
    if ((e.type == "mouseenter") && (e.pointerType != "mouse")) return;

    if (isWait) return;
    isWait = true;
    
    $(".js-filter-screen").toggleClass("is-show");

    setTimeout(() => {
      isWait = false;
    }, 200);
  });
}