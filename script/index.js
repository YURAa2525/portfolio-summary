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

    $(".debug-console").text(e.type);
  });
}


function slidePage() {
  const maxPageIx  = $(".js-slide-page").length - 1;
  let   showPageIx = 0;
  let isWait = false;

  // $(".main-screen").on("wheel", function(e) {
  //   if (e.originalEvent.deltaY != 0) return;

  //   if (0 < e.originalEvent.deltaX) {
  //     showPageIx = Math.min(showPageIx + 1, maxPageIx);
  //   }
  //   else {
  //     showPageIx = Math.max(showPageIx - 1, 0);
  //   }

  //   const moveX = $(".js-slide-page").width() * showPageIx * -1;
  //   $(".js-pages").css("transform", `translateX(${moveX}px)`);
  // });

  let startX = 0;
  $(".main-screen").on("touchstart", function(e) {
    isWait = false;
    startX = e.touches[0].clientX;
    $(".debug-console").text(e.type);
  });

  $(".main-screen").on("touchmove", function(e) {
    if (isWait) return;
    isWait = true;

    const dx = e.touches[0].clientX - startX;
    if (dx < 0) {
      showPageIx = Math.min(showPageIx + 1, maxPageIx);
    }
    else {
      showPageIx = Math.max(showPageIx - 1, 0);
    }

    const moveX = $(".js-slide-page").width() * showPageIx * -1;
    $(".js-pages").css("transform", `translateX(${moveX}px)`);

    $(".debug-console").text(e.type);
  });
}



// ポインタ特性で判定
// if (window.matchMedia("(pointer: coarse)").matches) {
//   console.log("タッチデバイス（スマホ・タブレット）");
// } else if (window.matchMedia("(pointer: fine)").matches) {
//   console.log("マウス操作が可能なデバイス（PC）");
// }
