$(function() {
  filterBtn();
});


function filterBtn() {
  let isWait = false;

  $(".header").on("click pointerenter", ".js-filter-btn", function(e) {
    if ((e.type == "pointerenter") && (e.pointerType != "mouse")) return;

    console.log(e.pointerType);

    if (isWait) return;
    isWait = true;
    
    $(".js-filter-screen").toggleClass("is-show");

    setTimeout(() => {
      isWait = false;
    }, 200);


    $(".debug-console").text(e.type);
  });
}