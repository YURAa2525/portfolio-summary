let g_userDevice = "pc";

$(function() {
  if (window.matchMedia("(pointer: coarse)").matches) g_userDevice = "mobile";

  if (g_userDevice == "pc") $(".js-pc-show").removeClass("is-hide");

  filterBtn();
  slidePage();
});


// ----------------------------------------------
// js-filter-btn のｸﾘｯｸまたはﾎﾊﾞｰで、js-filter-screen の表示/非表示を切り替える
// > ﾓﾊﾞｲﾙ端末では click と pointerenter が同時発火するため、ﾓﾊﾞｲﾙ端末の pointerenter では処理しない
// ----------------------------------------------
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


// ----------------------------------------------
// main-screen 上での横ｽｸﾛｰﾙまたは次矢印のｸﾘｯｸで、js-pages を動かし、js-slide-page の表示を切り替える
// また、表示中の js-slide-page に伴う、js-dot を強調表示する
// > ﾓﾊﾞｲﾙ端末では横ｽｸﾛｰﾙ、pc端末では次矢印のｸﾘｯｸのみで発火する
// ----------------------------------------------
function slidePage() {
  const maxPageIx   = $(".js-slide-page").length - 1;
  let   showPageIx  = 0;
  let   isWait      = false;
  
  if (g_userDevice == "mobile") {
    let   touchstartX = 0;

    $(".main-screen").on("touchstart", function(e) {
      isWait = false;
      touchstartX = e.touches[0].clientX;
    });

    $(".main-screen").on("touchmove", function(e) {
      if (isWait) return;
      isWait = true;

      const dx = e.touches[0].clientX - touchstartX;
      if (dx < 0) {
        showPageIx = Math.min(showPageIx + 1, maxPageIx);
      }
      else {
        showPageIx = Math.max(showPageIx - 1, 0);
      }

      slidePageCore();
      vividDot();
    });
  }
  else if (g_userDevice == "pc") {
    $(".main-screen").on("click", ".js-arrow", function() {
      if (isWait) return;
      isWait = true;

      const arrow = $(this).data("arrow");
      if (arrow == "right") {
        showPageIx = Math.min(showPageIx + 1, maxPageIx);
      }
      else if (arrow == "left") {
        showPageIx = Math.max(showPageIx - 1, 0);
      }

      slidePageCore();
      vividDot();

      setTimeout(() => {
        isWait = false;
      }, 200);
    });
  }

  function slidePageCore() {
    const slideX = $(".js-slide-page").width() * showPageIx * -1;
    $(".js-pages").css("transform", `translateX(${slideX}px)`);
  }

  function vividDot() {
    $(".js-dot").removeClass("is-vivid");
    $(".js-dot").eq(showPageIx).addClass("is-vivid");
  }
}




