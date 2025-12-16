$(function() {
  filterBtn();
  slidePage();
});


function filterBtn() {
  let isWait = false;

  $(".header").on("click pointerenter", ".js-filter-btn", function(e) {
    if ((e.type == "pointerenter") && (e.pointerType != "mouse")) return;

    if (isWait) return;
    isWait = true;
    
    $(".js-filter-screen").toggleClass("is-show");

    setTimeout(() => {
      isWait = false;
    }, 200);
  });
}


function slidePage() {
  const maxPageIx  = $(".js-slide-page").length - 1;
  let   showPageIx = 0;

  $(".main-screen").on("wheel", function(e) {
    if (e.originalEvent.deltaY != 0) return;

    if (0 < e.originalEvent.deltaX) {
      showPageIx = Math.min(showPageIx + 1, maxPageIx);
    }
    else {
      showPageIx = Math.max(showPageIx - 1, 0);
    }

    const moveX = $(".js-slide-page").width() * showPageIx * -1;
    $(".js-pages").css("transform", `translateX(${moveX}px)`);
  });
}



// ポインタ特性で判定
// if (window.matchMedia("(pointer: coarse)").matches) {
//   console.log("タッチデバイス（スマホ・タブレット）");
// } else if (window.matchMedia("(pointer: fine)").matches) {
//   console.log("マウス操作が可能なデバイス（PC）");
// }
